import type { SVGProps } from "react";

/**
 * The glyphs next to every direct channel — the two socials, WhatsApp and
 * email — in the footer. Plain text next to
 * plain text ("Instagram", "LinkedIn", a phone number, an inbox) reads as
 * one undifferentiated list; a mark in front of each is what lets an eye
 * skimming the row sort a channel out before reading its label.
 *
 * Instagram, LinkedIn and WhatsApp are drawn from the brands' own published
 * marks — a generic icon set does not carry those, since they are logos, not
 * concepts. `MailIcon` is Google's own Material Symbols "mail" outline,
 * which is the one glyph here with no brand to get right, so the common set
 * is the correct source for it. All four are inline `<svg>` rather than an
 * icon font or package: one flat colour each, `currentColor`, the same
 * convention `NovitMark`'s shapes already use.
 */
type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.848 0 3.204-.012 3.584-.07 4.85-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.82.679-1.382.896-.422.164-1.057.36-2.227.413-1.265.057-1.645.07-4.849.07s-3.584-.013-4.849-.07c-1.17-.054-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.82-.896-1.382-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85 0-3.202.012-3.582.07-4.848.054-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.382.42-.419.822-.679 1.382-.896.422-.166 1.057-.36 2.227-.415 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.278.058-2.15.261-2.913.558-.79.306-1.459.716-2.126 1.384-.667.667-1.077 1.335-1.384 2.125-.297.763-.499 1.635-.558 2.913-.058 1.28-.072 1.688-.072 4.948 0 3.259.014 3.668.072 4.948.058 1.277.261 2.149.558 2.912.307.79.717 1.459 1.384 2.126.667.666 1.336 1.077 2.126 1.384.763.296 1.635.499 2.913.558 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 1.277-.058 2.149-.262 2.913-.558.79-.306 1.458-.716 2.125-1.384.667-.667 1.077-1.336 1.384-2.126.296-.763.499-1.635.558-2.913.058-1.28.072-1.688.072-4.947 0-3.259-.014-3.667-.072-4.947-.058-1.278-.262-2.15-.558-2.913-.307-.79-.717-1.458-1.384-2.125-.667-.668-1.335-1.078-2.125-1.384-.764-.297-1.636-.5-2.913-.558-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/** Looked up by `siteContact.social`'s own `id`, so a channel gets a mark by
 *  naming itself rather than a component matching on its label text. */
export const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
} as const;
