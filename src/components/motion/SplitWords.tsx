import { Fragment } from "react";

type SplitWordsProps = {
  text: string;
};

/**
 * Wraps every word in an overflow mask so a headline can rise into place a
 * word at a time. Rendered on the server: the copy ships inside the heading,
 * the spaces between masks are real text nodes, and screen readers and
 * crawlers read the sentence exactly as written.
 *
 * The parent element carries `data-anim="words"`; Scene drives the masks.
 */
export function SplitWords({ text }: SplitWordsProps) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span className="split-mask">
            <span className="split-item">{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
