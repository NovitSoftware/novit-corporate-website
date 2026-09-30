import { Fragment } from "react";

type KeepCaseProps = {
  text: string;
};

/**
 * A label for an uppercase eyebrow, with any word written in mixed case on
 * purpose — CTOaaS — left as it is written. Uppercased it reads CTOAAS, which
 * is not the name.
 *
 * A word is mixed case when it has two capitals and a small letter, which no
 * ordinary word has; everything else is left to the eyebrow's
 * `text-transform`.
 */
export function KeepCase({ text }: KeepCaseProps) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {isMixedCase(word) ? <span className="normal-case">{word}</span> : word}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function isMixedCase(word: string): boolean {
  const capitals = word.match(/[A-ZÁÉÍÓÚÑÜ]/g) ?? [];
  return capitals.length >= 2 && /[a-záéíóúñü]/.test(word);
}
