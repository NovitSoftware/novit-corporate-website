import Image from "next/image";
import { BRAND_LOGO } from "@/lib/brand-logo";

/**
 * The curtain's two layers, which only the home page's first load shows. The
 * layout puts the ground under the page stage and the mark over it, so the
 * page opens out of the ground while the logo leaves above it.
 * `PageTransitions` drives both; `curtain.css` shows them only while
 * `html[data-curtain]` is set.
 *
 * The badge the logo stands in has no edge drawn round it: it is uncovered by
 * the frame opening, and the ground's celeste — the glow behind it, the
 * echoes of its edge going out — is all that marks it.
 *
 * The logo is only ever framed, moved and uncovered — never recoloured and
 * never given an effect, which the brand rules out.
 *
 * Both are hidden from assistive technology: the page underneath is only
 * clipped, never removed, so it reads in full the whole time, and the router
 * already announces each navigation.
 */
export function CurtainGround() {
  return (
    <div
      data-curtain-ground
      aria-hidden="true"
      className="page-curtain curtain-ground"
    >
      {/* Stepped along their axis on each beat of the curtain. */}
      <div data-curtain-ramps className="curtain-ramps">
        <span className="curtain-ramp curtain-ramp-cabecera" />
        <span data-curtain-cierre className="curtain-ramp curtain-ramp-cierre" />
      </div>
      <span className="curtain-bloom" />
      {/* Lights up behind the badge as it opens. */}
      <span data-curtain-glow className="curtain-glow" />
      {/* Echoes of the badge's edge, one per beat, radiating into the ground. */}
      <span data-curtain-ripple className="curtain-ripple" />
      <span data-curtain-ripple className="curtain-ripple" />
    </div>
  );
}

export function CurtainMark() {
  return (
    <div
      data-curtain-mark
      data-tone="dark"
      aria-hidden="true"
      className="page-curtain page-curtain-mark"
    >
      <div data-curtain-window className="page-curtain-window">
        <div
          data-curtain-stack
          className="flex flex-col items-center gap-7 px-6"
        >
          {/* On a phone the logo follows the width: the badge is the logo
              plus 6rem of margin, and at a flat 15rem it took nine tenths of
              a 375px screen and all of a 320px one — a band across the
              ground, its edge on the screen's. Under half the width keeps it
              a badge, about seven tenths across. */}
          <div className="w-[min(15rem,46vw)] sm:w-[20rem]">
            <Image
              src={BRAND_LOGO.lockup.white}
              alt=""
              width={BRAND_LOGO.lockup.width}
              height={BRAND_LOGO.lockup.height}
              priority
              sizes="(max-width: 640px) 240px, 320px"
              className="h-auto w-full"
            />
          </div>
          <span data-curtain-rule className="curtain-rule w-40" />
        </div>
      </div>
    </div>
  );
}
