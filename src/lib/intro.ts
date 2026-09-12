/**
 * Hand-off between the intro curtain and the hero, and the record of whether
 * the curtain has already played.
 *
 * The hero builds its timeline paused and waits here, so the first thing the
 * visitor sees is one continuous move — the curtain lifting straight into the
 * headline — instead of two animations that happen to overlap.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let completed = false;

export function markIntroComplete(): void {
  if (completed) {
    return;
  }

  completed = true;
  for (const listener of listeners) {
    listener();
  }
  listeners.clear();
}

/** Runs `listener` when the curtain is gone, or right away if it already is. */
export function onIntroComplete(listener: Listener): () => void {
  if (completed) {
    listener();
    return () => {};
  }

  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * ## Why there is no "already played" flag
 *
 * There was one, in `sessionStorage`, and it was wrong: it meant the curtain
 * ran once and then never again for the rest of the browsing session, so the
 * animation effectively vanished after the first load of the day. The curtain
 * is the site introducing itself and it should do that when someone arrives.
 *
 * The case that *is* worth suppressing is a visitor who goes to the Academia
 * and comes back — being introduced again because you clicked two links is
 * irritating. But there is nowhere to record that: nothing on this site uses
 * `next/link`, so every internal link is a plain `<a href>` and every
 * navigation is a fresh document. No module variable survives one, and
 * `sessionStorage` cannot tell that trip apart from a reload.
 *
 * So: the curtain plays on every arrival at the home page, which is the only
 * page that mounts it. Telling the two apart is possible, but it needs real
 * client-side navigation first — swap the internal anchors for `next/link` and
 * a module variable here becomes the whole answer.
 */
