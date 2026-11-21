/**
 * Build a YouTube-style SVG icon wrapped in a span.
 * All nodes are created with DOM calls so YouTube's Trusted Types policy
 * is never violated (no innerHTML).
 */
export function createSvgIcon(pathD, className) {
  const icon = document.createElement('span');
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');

  const shell = document.createElement('div');
  shell.style.width = '100%';
  shell.style.height = '100%';
  shell.style.display = 'block';
  shell.style.fill = 'currentcolor';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.pointerEvents = 'none';
  svg.style.display = 'inherit';
  svg.style.width = '100%';
  svg.style.height = '100%';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);

  svg.appendChild(path);
  shell.appendChild(svg);
  icon.appendChild(shell);
  return icon;
}
