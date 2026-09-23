import { SquareGrid } from "@/components/ui/SquareGrid";

/**
 * The atmosphere over the scene gradient: sweep, blooms and veil, square grid.
 * The layout draws it under the page, and the menu draws it again on its own
 * curtain so opening the menu keeps the same background.
 *
 * All `position: fixed` with no z-index, so tree order is the stacking; see
 * scene.css before reordering.
 */
export function SceneAtmosphere() {
  return (
    <>
      <div className="scene-sweep" aria-hidden="true" />
      <div className="scene-blooms" aria-hidden="true">
        <span className="scene-bloom scene-bloom-azul" />
        <span className="scene-bloom scene-bloom-celeste" />
        <span className="scene-bloom scene-bloom-violeta" />
      </div>
      <div className="scene-cells" aria-hidden="true">
        {/* Canvas can't read CSS vars: --voz-suave and --rgb-celeste. */}
        <SquareGrid
          direction="diagonal"
          speed={0.25}
          squareSize={44}
          lineColor="rgba(241, 235, 251, 0.15)"
          hoverFillColor="rgba(61, 176, 228, 0.22)"
          hoverTrailAmount={4}
        />
      </div>
    </>
  );
}
