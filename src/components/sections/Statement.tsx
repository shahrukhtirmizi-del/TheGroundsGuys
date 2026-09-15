import OrbitHeading from "../fx/OrbitHeading";
import Reveal from "../ui/Reveal";

const PLATES = [
  "/service-mowing.jpg",
  "/after-lawn.jpg",
  "/service-landscape-install.jpg",
  "/team-crew.jpg",
  "/service-irrigation.jpg",
  "/cta-wide-shot.jpg",
  "/hero-poster.jpg",
];

/**
 * The proposition, straight after the hero: our photography orbits the
 * words, then one plain paragraph under it says who we are.
 */
export default function Statement() {
  return (
    <section className="relative overflow-hidden pt-4 md:pt-2" aria-labelledby="statement-h">
      <div className="mx-auto max-w-[1280px] px-2 md:px-8">
        <OrbitHeading
          lineOne="Rooted in Davenport."
          lineTwo="Grown with care."
          images={PLATES}
          className="aspect-square sm:aspect-[16/10] md:aspect-[16/9]"
        />
      </div>
      <div className="mx-auto max-w-[1280px] px-5 pb-20 md:px-8 md:pb-28">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p id="statement-h" className="lead text-[var(--ink-70)] md:text-[21px]">
            We are a locally owned Grounds Guys team, backed by the national network, doing one thing well:
            keeping the lawns, beds and trees of Davenport looking like someone cares about them. Because we do.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
