"use client";

import { useEffect, useRef } from "react";

/**
 * An oversized two-line headline ringed by orbiting photo plates.
 *
 * A tilted ring of rounded 1:1 plates is projected with a simple perspective
 * divide and drawn back-to-front (painter's algorithm); the headline layer is
 * painted at the moment the ring crosses behind the text, so plates pass in
 * front of the words on the near side and behind them on the far side. Each
 * plate is a canvas texture built once from a photograph: cover-fit, then a
 * warm wash so the photography sits inside the page palette instead of
 * shouting over it. The far side of each plate is a deeper, greener version.
 *
 * Holds a single still frame under prefers-reduced-motion and stops
 * rendering when scrolled out of view.
 */

const DW = 1600;
const DH = 900;
const DASP = DW / DH;

const RING = {
  cx: 800,
  cy: 452,
  a: 385, // projected semi-major axis
  ratio: 0.492, // semi-minor / semi-major
  axis: 25.5, // screen angle of the major axis, degrees
  n: 12, // plates
  tile: 187, // plate side in ring units where R = a
  radius: 0.22, // corner radius as a fraction of the side
  dist: 13, // camera distance in ring radii
  phase: 93,
};

const DUR = 30; // seconds per revolution
const TS = 420; // plate texture resolution

export default function OrbitHeading({
  lineOne,
  lineTwo,
  images,
  className = "",
}: {
  lineOne: string;
  lineTwo: string;
  images: string[];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let visible = true;

    let W = 0;
    let H = 0;
    let K = 1;
    let OX = 0;
    let OY = 0;
    let headLayer: HTMLCanvasElement | null = null;

    const front: HTMLCanvasElement[] = [];
    const back: HTMLCanvasElement[] = [];

    const d2sx = (x: number) => OX + x * K;
    const d2sy = (y: number) => OY + y * K;

    function mkc(w: number, h: number) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    }

    /* ring plane basis: u / v span the plane, z points at the viewer */
    const ax = (RING.axis * Math.PI) / 180;
    const cf = RING.ratio;
    const sf = Math.sqrt(1 - cf * cf);
    const U = [Math.cos(ax), Math.sin(ax), 0];
    const V = [-Math.sin(ax) * cf, Math.cos(ax) * cf, sf];
    const AXIS = [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]];

    function roundRectPath(x: CanvasRenderingContext2D, w: number, h: number, r: number) {
      x.beginPath();
      x.moveTo(-w / 2 + r, -h / 2);
      x.lineTo(w / 2 - r, -h / 2);
      x.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      x.lineTo(w / 2, h / 2 - r);
      x.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      x.lineTo(-w / 2 + r, h / 2);
      x.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      x.lineTo(-w / 2, -h / 2 + r);
      x.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      x.closePath();
    }

    /* plate textures: cover-fit the photo, warm it, then build the darker far side */
    function buildTexture(img: HTMLImageElement) {
      const c = mkc(TS, TS);
      const x = c.getContext("2d");
      if (!x) return null;

      x.fillStyle = "#e9efe1";
      x.fillRect(0, 0, TS, TS);

      const scale = Math.max(TS / img.width, TS / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      x.imageSmoothingQuality = "high";
      x.drawImage(img, (TS - w) / 2, (TS - h) / 2, w, h);

      // a light warm multiply keeps the greens in the brand family, then a
      // faint bone wash lifts the whole plate toward the page background
      x.globalCompositeOperation = "multiply";
      x.fillStyle = "rgba(236, 232, 214, 1)";
      x.fillRect(0, 0, TS, TS);
      x.globalCompositeOperation = "source-over";
      x.fillStyle = "rgba(248, 246, 239, 0.12)";
      x.fillRect(0, 0, TS, TS);

      const d = mkc(TS, TS);
      const y = d.getContext("2d");
      if (y) {
        y.drawImage(c, 0, 0);
        y.globalCompositeOperation = "multiply";
        y.fillStyle = "rgba(52, 83, 29, 0.55)";
        y.fillRect(0, 0, TS, TS);
      }
      return { front: c, back: d };
    }

    /** Font size at which `str` inks exactly `targetW` wide. */
    function sizeForWidth(x: CanvasRenderingContext2D, str: string, font: string, weight: string, targetW: number) {
      const probe = 100;
      x.font = `${weight} ${probe}px ${font}`;
      const m = x.measureText(str);
      const inkW = (m.actualBoundingBoxRight || m.width) + (m.actualBoundingBoxLeft || 0);
      return inkW > 0 ? (probe * targetW) / inkW : probe;
    }

    function drawLine(
      x: CanvasRenderingContext2D,
      str: string,
      font: string,
      weight: string,
      size: number,
      cx: number,
      baseline: number,
      color: string
    ) {
      x.save();
      x.font = `${weight} ${size}px ${font}`;
      x.fillStyle = color;
      x.textBaseline = "alphabetic";
      x.textAlign = "center";
      x.fillText(str, cx, baseline);
      x.restore();
    }

    function buildHead(fontFamily: string) {
      headLayer = mkc(Math.max(1, W), Math.max(1, H));
      const x = headLayer.getContext("2d");
      if (!x) return;

      // the headline has to out-measure the ring, or the plates cross the
      // words instead of orbiting them
      const targetW = DW * 0.62 * K;
      const longer = lineOne.length >= lineTwo.length ? lineOne : lineTwo;
      const size = sizeForWidth(x, longer, fontFamily, "800", targetW);

      x.font = `800 ${size}px ${fontFamily}`;
      const cap = x.measureText("H").actualBoundingBoxAscent || size * 0.71;
      const gap = cap * 1.24;

      const blockTop = d2sy(RING.cy) - (cap + gap) / 2;
      drawLine(x, lineOne, fontFamily, "800", size, d2sx(RING.cx), blockTop + cap, "#b9bdb0");
      drawLine(x, lineTwo, fontFamily, "800", size, d2sx(RING.cx), blockTop + cap + gap, "#34531d");
    }

    function project(p: number[]) {
      const k = (RING.a * K * RING.dist) / (RING.dist - p[2]);
      return [d2sx(RING.cx) + k * p[0], d2sy(RING.cy) + k * p[1], k];
    }

    function drawTile(i: number, psi: number) {
      if (!ctx) return;
      const c = Math.cos(psi);
      const s = Math.sin(psi);
      const C = [c * U[0] + s * V[0], c * U[1] + s * V[1], c * U[2] + s * V[2]];
      const T = [-s * U[0] + c * V[0], -s * U[1] + c * V[1], -s * U[2] + c * V[2]];
      const h = RING.tile / (2 * RING.a);
      const p0 = project(C);
      const pT = project([C[0] + T[0] * h, C[1] + T[1] * h, C[2] + T[2] * h]);
      const pA = project([C[0] + AXIS[0] * h, C[1] + AXIS[1] * h, C[2] + AXIS[2] * h]);
      const ex = pT[0] - p0[0];
      const ey = pT[1] - p0[1];
      const fx = pA[0] - p0[0];
      const fy = pA[1] - p0[1];
      if (Math.abs(ex * fy - ey * fx) < 0.4) return; // edge on

      const facing = C[2] > 0;
      const set = facing ? front : back;
      const img = set[i % images.length];
      if (!img) return;

      ctx.save();
      ctx.setTransform((ex * 2) / TS, (ey * 2) / TS, (fx * 2) / TS, (fy * 2) / TS, p0[0], p0[1]);
      roundRectPath(ctx, TS, TS, TS * RING.radius);
      ctx.clip();
      ctx.drawImage(img, -TS / 2, -TS / 2, TS, TS);
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function render(t: number) {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingQuality = "high";

      const spin = (t / DUR) * Math.PI * 2;
      const list: { i: number; psi: number; z: number }[] = [];
      for (let i = 0; i < RING.n; i++) {
        const psi = (RING.phase * Math.PI) / 180 - (i * 2 * Math.PI) / RING.n + spin;
        const c = Math.cos(psi);
        const s = Math.sin(psi);
        list.push({ i, psi, z: c * U[2] + s * V[2] });
      }
      list.sort((a, b) => a.z - b.z);

      let drawnText = false;
      for (let i = 0; i < list.length; i++) {
        if (!drawnText && list[i].z > 0 && headLayer) {
          ctx.drawImage(headLayer, 0, 0);
          drawnText = true;
        }
        drawTile(list[i].i, list[i].psi);
      }
      if (!drawnText && headLayer) ctx.drawImage(headLayer, 0, 0);
    }

    function resize() {
      if (!wrap || !cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(wrap.clientWidth * dpr));
      H = Math.max(1, Math.round(wrap.clientHeight * dpr));
      cv.width = W;
      cv.height = H;
      // scale the design frame up as far as the headline (the widest thing)
      // and the ring's vertical reach allow, so phones get a full-width ring
      // instead of a 1600px frame shrunk to a thumbnail
      const fit = Math.min(W, H * DASP) / DW;
      K = Math.min(fit * 1.6, (0.94 * W) / (DW * 0.62), H / (DH * 0.86));
      OX = (W - DW * K) / 2;
      OY = (H - DH * K) / 2;
      buildHead(fontFamily);
    }

    let fontFamily = "system-ui, sans-serif";
    let t0 = performance.now();
    let tNow = 0;

    function frame(now: number) {
      if (disposed) return;
      if (!visible) {
        raf = 0;
        return;
      }
      tNow = ((now - t0) / 1000) % DUR;
      render(tNow);
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce && !raf && !disposed) {
          t0 = performance.now() - tNow * 1000;
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(cv);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce || !raf) render(tNow);
    });

    async function start() {
      fontFamily = getComputedStyle(wrap!).fontFamily || fontFamily;
      try {
        await document.fonts.ready;
      } catch {
        /* the fallback stack still renders */
      }
      if (disposed) return;

      resize();
      ro.observe(wrap!);

      let started = false;
      const begin = () => {
        if (started || disposed) return;
        started = true;
        if (reduce) {
          render(0);
        } else {
          t0 = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };

      images.forEach((src, i) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          if (disposed) return;
          const tex = buildTexture(im);
          if (tex) {
            front[i] = tex.front;
            back[i] = tex.back;
          }
          begin();
          if (reduce) render(0);
        };
        im.onerror = () => begin();
        im.src = src;
      });
    }

    start();

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lineOne, lineTwo, images]);

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <canvas ref={canvasRef} aria-hidden style={{ display: "block", width: "100%", height: "100%" }} />
      {/* the headline is painted into the canvas, so it is repeated here for screen readers */}
      <h2 className="sr-only">
        {lineOne} {lineTwo}
      </h2>
    </div>
  );
}
