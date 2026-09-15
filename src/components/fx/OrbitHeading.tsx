"use client";

import { useEffect, useRef } from "react";

/**
 * An oversized two-line headline ringed by orbiting photo plates.
 *
 * A tilted ring of rounded 1:1 plates is projected with a simple perspective
 * divide and drawn back-to-front (painter's algorithm). Each plate is a canvas
 * texture built once from a photograph: cover-fit, a warm wash so the
 * photography sits inside the page palette, rounded corners baked in so no
 * clip path is needed per frame. The far side of each plate is a deeper,
 * greener version.
 *
 * The ring is sized so the headline sits fully inside it: plates pass below
 * the words on the near side and above them on the far side, never across
 * them (geometry checked with scripts/orbit-fit.mjs). Because they never
 * overlap, the headline is ordinary DOM text laid over the canvas, and the
 * canvas only ever draws the twelve plates. Renders at 30fps at 1x DPR, holds
 * a still frame under prefers-reduced-motion and stops when scrolled away.
 */

const DW = 1600;
const DH = 900;

const RING = {
  cx: 800,
  cy: 450,
  a: 620, // projected semi-major axis
  ratio: 0.55, // semi-minor / semi-major
  axis: 8, // screen angle of the major axis, degrees
  n: 12, // plates
  tile: 170, // plate side in ring units where R = a
  radius: 0.22, // corner radius as a fraction of the side
  dist: 13, // camera distance in ring radii
  phase: 93,
};

const TEXT_W = 940 / DW; // headline width as a fraction of the frame; clears the ring
const DUR = 30; // seconds per revolution
const FRAME_MS = 1000 / 30; // the ring turns slowly; 30fps is indistinguishable and half the work
const TS = 360; // plate texture resolution

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

    function roundRectPath(x: CanvasRenderingContext2D, w: number, h: number, r: number, cx = 0, cy = 0) {
      x.beginPath();
      x.moveTo(cx - w / 2 + r, cy - h / 2);
      x.lineTo(cx + w / 2 - r, cy - h / 2);
      x.quadraticCurveTo(cx + w / 2, cy - h / 2, cx + w / 2, cy - h / 2 + r);
      x.lineTo(cx + w / 2, cy + h / 2 - r);
      x.quadraticCurveTo(cx + w / 2, cy + h / 2, cx + w / 2 - r, cy + h / 2);
      x.lineTo(cx - w / 2 + r, cy + h / 2);
      x.quadraticCurveTo(cx - w / 2, cy + h / 2, cx - w / 2, cy + h / 2 - r);
      x.lineTo(cx - w / 2, cy - h / 2 + r);
      x.quadraticCurveTo(cx - w / 2, cy - h / 2, cx - w / 2 + r, cy - h / 2);
      x.closePath();
    }

    /* plate textures: cover-fit the photo, warm it, then build the darker far side.
       The bitmap arrives already decoded and resized off the main thread, so
       this is a handful of cheap TSxTS fills rather than a full JPEG decode. */
    function buildTexture(img: ImageBitmap) {
      const c = mkc(TS, TS);
      const x = c.getContext("2d");
      if (!x) return null;

      // rounded corners baked into the texture: the per-frame draw is then a
      // plain transformed drawImage with no clip
      roundRectPath(x, TS, TS, TS * RING.radius, TS / 2, TS / 2);
      x.clip();
      x.fillStyle = "#e9efe1";
      x.fillRect(0, 0, TS, TS);
      x.drawImage(img, 0, 0, TS, TS);
      img.close();

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
        y.globalCompositeOperation = "source-atop";
        y.fillStyle = "rgba(52, 83, 29, 0.55)";
        y.fillRect(0, 0, TS, TS);
      }
      return { front: c, back: d };
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

      ctx.setTransform((ex * 2) / TS, (ey * 2) / TS, (fx * 2) / TS, (fy * 2) / TS, p0[0], p0[1]);
      ctx.drawImage(img, -TS / 2, -TS / 2, TS, TS);
    }

    function render(t: number) {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingQuality = "medium";

      const spin = (t / DUR) * Math.PI * 2;
      const list: { i: number; psi: number; z: number }[] = [];
      for (let i = 0; i < RING.n; i++) {
        const psi = (RING.phase * Math.PI) / 180 - (i * 2 * Math.PI) / RING.n + spin;
        const c = Math.cos(psi);
        const s = Math.sin(psi);
        list.push({ i, psi, z: c * U[2] + s * V[2] });
      }
      list.sort((a, b) => a.z - b.z);
      for (let i = 0; i < list.length; i++) drawTile(list[i].i, list[i].psi);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function resize() {
      if (!wrap || !cv) return;
      // plates are photographs seen in motion; 1x is plenty and half the fill
      const dpr = 1;
      W = Math.max(1, Math.round(wrap.clientWidth * dpr));
      H = Math.max(1, Math.round(wrap.clientHeight * dpr));
      cv.width = W;
      cv.height = H;
      // fit the frame to the height; on narrow screens let the ring run off
      // the sides rather than shrink the headline below 90% of the width
      K = Math.min(H / DH, (0.9 * W) / (DW * TEXT_W));
      OX = (W - DW * K) / 2;
      OY = (H - DH * K) / 2;
      // the DOM headline follows the same frame: width and font size in CSS px
      const textW = (DW * TEXT_W * K) / dpr;
      wrap.style.setProperty("--orbit-text-w", `${textW}px`);
      wrap.style.setProperty("--orbit-cy", `${(OY + RING.cy * K) / dpr}px`);
      // font size at which the longer line inks exactly textW wide, measured
      // in the real webfont rather than guessed from a character count
      const h2 = wrap.querySelector("h2");
      if (h2) {
        const meter = measure.getContext("2d");
        if (meter) {
          meter.font = `800 100px ${getComputedStyle(h2).fontFamily}`;
          const longer = lineOne.length >= lineTwo.length ? lineOne : lineTwo;
          const ink = meter.measureText(longer).width || 1;
          wrap.style.setProperty("--orbit-font", `${(textW * 100) / ink}px`);
        }
      }
    }

    let t0 = performance.now();
    let tNow = 0;
    let lastDraw = 0;

    function frame(now: number) {
      if (disposed) return;
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;
      tNow = ((now - t0) / 1000) % DUR;
      render(tNow);
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

    const measure = mkc(1, 1);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce || !raf) render(tNow);
    });

    async function start() {
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

      // decode + cover-crop each photo off the main thread, one at a time,
      // so the page never stalls while seven JPEGs are unpacked at once
      for (const [i, src] of images.entries()) {
        try {
          const blob = await fetch(src).then((r) => r.blob());
          if (disposed) return;
          const full = await createImageBitmap(blob);
          if (disposed) {
            full.close();
            return;
          }
          // centre crop to a square, then downscale to the plate size
          const side = Math.min(full.width, full.height);
          const bmp = await createImageBitmap(full, (full.width - side) / 2, (full.height - side) / 2, side, side, {
            resizeWidth: TS,
            resizeHeight: TS,
            resizeQuality: "high",
          });
          full.close();
          if (disposed) {
            bmp.close();
            return;
          }
          const tex = buildTexture(bmp);
          if (tex) {
            front[i] = tex.front;
            back[i] = tex.back;
          }
        } catch {
          /* a missing photo leaves an empty slot; the ring still turns */
        }
        begin();
        if (reduce) render(0);
      }
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
      {/* the headline sits in the clear centre of the ring; width and centre
          come from the same frame maths that places the plates */}
      <h2
        className="pointer-events-none absolute left-1/2 text-center font-extrabold"
        style={{
          width: "var(--orbit-text-w, 60%)",
          top: "var(--orbit-cy, 50%)",
          transform: "translate(-50%, -50%)",
          fontSize: "var(--orbit-font, calc(var(--orbit-text-w, 600px) / 11))",
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
        }}
      >
        <span className="block" style={{ color: "#666c5f" }}>
          {lineOne}
        </span>
        <span className="block" style={{ color: "var(--green)" }}>
          {lineTwo}
        </span>
      </h2>
    </div>
  );
}
