/**
 * Remembers which author name was last scored for each comment element.
 *
 * Used instead of a DOM marker so a comment whose author text is filled in
 * later (or whose element is reused by YouTube for another author) is
 * scored again instead of being skipped forever.
 */
export function createProcessedTracker() {
  const seen = new WeakMap();

  return {
    shouldProcess(element, author) {
      if (!author) return false;
      if (seen.get(element) === author) return false;
      seen.set(element, author);
      return true;
    },
  };
}
