/**
 * Bounded queue for DOM nodes added between animation frames.
 *
 * A hidden tab never runs requestAnimationFrame, so without a bound the queue
 * would pin every element YouTube adds for the whole hidden session. Overflow
 * makes `take()` return null, telling the caller to do a full scan instead.
 */
export function createPendingQueue(max = 1000) {
  const nodes = [];
  let overflowed = false;

  return {
    push(node) {
      if (nodes.length >= max) {
        nodes.length = 0;
        overflowed = true;
        return;
      }
      nodes.push(node);
    },
    take() {
      if (overflowed) {
        overflowed = false;
        return null;
      }
      return nodes.splice(0);
    },
    clear() {
      nodes.length = 0;
      overflowed = false;
    },
    get size() {
      return nodes.length;
    },
    get overflowed() {
      return overflowed;
    },
  };
}
