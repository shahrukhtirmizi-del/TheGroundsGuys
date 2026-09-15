/**
 * Film grain, kept near-invisible. A fixed, pointer-events-none layer tiled
 * with a small pre-rendered noise PNG (public/grain.png): a plain GPU texture,
 * unlike an SVG feTurbulence filter, which the compositor keeps re-rasterizing.
 * No mix-blend-mode, which would force a re-blend of the page every frame.
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ opacity: 0.045, backgroundImage: "url(/grain.png)", backgroundSize: "128px 128px" }}
    />
  );
}
