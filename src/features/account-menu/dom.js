/** YouTube renders the multi-page menu in the light DOM or a shadow root. */
export function getMenuRoot(menuRenderer) {
  return menuRenderer.shadowRoot || menuRenderer;
}

export function getMenuParts(menuRenderer) {
  const candidates = [];
  if (menuRenderer.shadowRoot) candidates.push(menuRenderer.shadowRoot);
  candidates.push(menuRenderer);

  for (const root of candidates) {
    const sections = root.querySelector('#sections');
    if (!sections) continue;
    return {
      root,
      container: root.querySelector('#container'),
      submenuHost: root.querySelector('#submenu'),
      sections,
    };
  }

  const root = getMenuRoot(menuRenderer);
  return {
    root,
    container: root.querySelector('#container'),
    submenuHost: root.querySelector('#submenu'),
    sections: null,
  };
}

export function isDropdownClosed(dropdown) {
  if (!dropdown || !dropdown.isConnected) return true;
  if (dropdown.hasAttribute('hidden')) return true;
  if (dropdown.getAttribute('aria-hidden') === 'true') return true;
  if (dropdown.style.display === 'none') return true;
  // Polymer iron-dropdown exposes `.opened` when upgraded
  if (typeof dropdown.opened === 'boolean' && !dropdown.opened) return true;
  return false;
}
