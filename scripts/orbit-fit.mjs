// Searches ring geometry for OrbitHeading: the headline must never be covered
// by a plate across a full revolution, and the ring must fit the 1600x900 frame.
const DW = 1600, DH = 900, N = 12, DIST = 13, PHASE = 93;
const CHARS = 20; // "Rooted in Davenport."
function overlaps(ring, targetW) {
  const { a, ratio, axis, tile, cx, cy } = ring;
  const ax = (axis * Math.PI) / 180, cf = ratio, sf = Math.sqrt(1 - cf * cf);
  const U = [Math.cos(ax), Math.sin(ax), 0], V = [-Math.sin(ax) * cf, Math.cos(ax) * cf, sf];
  const AXIS = [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]];
  const project = (p) => { const k = (a * DIST) / (DIST - p[2]); return [cx + k * p[0], cy + k * p[1]]; };
  const size = targetW / (CHARS * 0.56); const cap = 0.72 * size, gap = cap * 1.24;
  const rect = { l: cx - targetW / 2, r: cx + targetW / 2, t: cy - (cap + gap) / 2, b: cy + (cap + gap) / 2 + 0.22 * size };
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let s = 0; s < 240; s++) {
    const spin = (s / 240) * Math.PI * 2;
    for (let i = 0; i < N; i++) {
      const psi = (PHASE * Math.PI) / 180 - (i * 2 * Math.PI) / N + spin;
      const c = Math.cos(psi), sn = Math.sin(psi);
      const C = [c * U[0] + sn * V[0], c * U[1] + sn * V[1], c * U[2] + sn * V[2]];
      const T = [-sn * U[0] + c * V[0], -sn * U[1] + c * V[1], -sn * U[2] + c * V[2]];
      const h = tile / (2 * a);
      const p0 = project(C), pT = project([C[0] + T[0] * h, C[1] + T[1] * h, C[2] + T[2] * h]);
      const pA = project([C[0] + AXIS[0] * h, C[1] + AXIS[1] * h, C[2] + AXIS[2] * h]);
      const e = [pT[0] - p0[0], pT[1] - p0[1]], f = [pA[0] - p0[0], pA[1] - p0[1]];
      for (let u = -1; u <= 1; u += 0.25) for (let v = -1; v <= 1; v += 0.25) {
        const x = p0[0] + u * e[0] + v * f[0], y = p0[1] + u * e[1] + v * f[1];
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        if (x > rect.l && x < rect.r && y > rect.t && y < rect.b) return { hit: true };
      }
    }
  }
  return { hit: false, box: [minX, maxX, minY, maxY], rect, size };
}
const results = {};
let best = null;
for (const axis of [0, 8, 14, 20, 25.5]) for (const ratio of [0.42, 0.48, 0.55, 0.62, 0.7])
  for (const a of [420, 460, 500, 540, 580, 620]) for (const tile of [150, 170, 187, 205])
    for (const targetW of [700, 760, 820, 880, 940, 1000, 1060]) {
      const r = overlaps({ a, ratio, axis, tile, cx: 800, cy: 450 }, targetW);
      if (r.hit) continue;
      const [x0, x1, y0, y1] = r.box;
      if (x0 < 0 || x1 > DW || y0 < 0 || y1 > DH) continue;
      const score = targetW + tile * 0.6 + a * 0.2 + axis * 1.5;
      const cand = { score, a, ratio, axis, tile, targetW, box: r.box.map(Math.round), size: Math.round(r.size) };
      if (!results[axis] || score > results[axis].score) results[axis] = cand;
      if (!best || score > best.score) best = cand;
    }
console.log(results);
