/**
 * The hand-off between the page curtain and whatever a page plays on arrival.
 *
 * Every route opens behind the curtain — on the first load and after each
 * navigation — so anything that animates on arrival builds itself paused and
 * waits here. It then runs while the page is opening instead of finishing
 * unseen underneath it.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let revealed = false;

/** The curtain is closing: arrivals from here on wait for the next reveal. */
export function coverPage(): void {
  revealed = false;
}

export function revealPage(): void {
  if (revealed) {
    return;
  }

  revealed = true;
  const queued = [...listeners];
  listeners.clear();
  for (const listener of queued) {
    listener();
  }
}

/** Runs `listener` once the page is open, or right away if it already is. */
export function onPageReveal(listener: Listener): () => void {
  if (revealed) {
    listener();
    return () => {};
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
