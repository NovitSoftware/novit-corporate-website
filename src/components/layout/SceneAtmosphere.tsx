import { DotField } from "@/components/ui/DotField";

/**
 * The atmosphere over the scene gradient: sweep, blooms and veil, dot field.
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
        <DotField
          dotRadius={2}
          dotSpacing={16}
          gradientFrom="rgba(61, 176, 228, 0.42)"
          gradientTo="rgba(241, 235, 251, 0.3)"
          glowColor="rgba(4, 0, 56, 0.45)"
        />
      </div>
    </>
  );
}
