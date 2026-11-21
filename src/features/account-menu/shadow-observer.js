/**
 * Attach one observer per account-menu shadow root, at most once.
 *
 * A MutationObserver watching documentElement never receives records from
 * inside a shadow root, so Polymer stamping the menu's #sections there would
 * otherwise be invisible to us. The registry keeps that bookkeeping testable.
 */
export function createShadowObserverRegistry({ observe }) {
  const seen = new WeakSet();

  return {
    attach(menuRenderer) {
      const shadow = menuRenderer?.shadowRoot;
      if (!shadow || seen.has(shadow)) return false;
      seen.add(shadow);
      observe(shadow);
      return true;
    },
  };
}
