import { Fragment } from "react";

/**
 * A content string with its highlights: what the copy wraps in `**…**` comes
 * out marked (`.hl`, in `styles/highlight.css`), the rest as it is.
 *
 * The highlights are written for the reader who only skims: read on their
 * own, one after the other, they still say what the text promises — so they
 * are few, one or two short phrases a block, and always the gain, never the
 * problem.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split("**");
  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="hl">
        {part}
      </mark>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
