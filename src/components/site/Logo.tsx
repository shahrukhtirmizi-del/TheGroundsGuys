import Link from "next/link";

/**
 * Header and footer lockup. Renders the supplied logo file when one exists in
 * /public; otherwise a wordmark in the brand's own two colors so the header
 * never ships empty.
 */
export default function Logo({
  src,
  onDark = false,
  className = "",
}: {
  src: string | null;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" aria-label="The Grounds Guys of Davenport, FL, home" className={`inline-flex items-center ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="The Grounds Guys" className="h-10 w-auto md:h-11" />
      ) : (
        <span className="flex items-baseline gap-[3px] leading-none" style={{ letterSpacing: "-0.035em" }}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.04em]" style={{ color: onDark ? "var(--on-dark)" : "var(--green)" }}>
            The
          </span>
          <span className="text-[24px] font-extrabold md:text-[26px]" style={{ color: onDark ? "var(--on-dark)" : "var(--green)" }}>
            Grounds
          </span>
          <span className="text-[24px] font-extrabold md:text-[26px]" style={{ color: "var(--yellow-muted)" }}>
            Guys
          </span>
        </span>
      )}
    </Link>
  );
}
