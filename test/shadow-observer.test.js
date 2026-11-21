import test from 'node:test';
import assert from 'node:assert/strict';
import { createShadowObserverRegistry } from '../src/features/account-menu/shadow-observer.js';

test('attaches an observer to a shadow root exactly once', () => {
  const observed = [];
  const registry = createShadowObserverRegistry({ observe: (root) => observed.push(root) });
  const shadow = {};
  const menu = { shadowRoot: shadow };

  assert.equal(registry.attach(menu), true);
  assert.equal(registry.attach(menu), false);
  assert.deepEqual(observed, [shadow]);
});

test('ignores menu renderers without a shadow root', () => {
  const registry = createShadowObserverRegistry({ observe: () => assert.fail('must not observe') });
  assert.equal(registry.attach({}), false);
  assert.equal(registry.attach(null), false);
});

test('observes distinct shadow roots independently', () => {
  const observed = [];
  const registry = createShadowObserverRegistry({ observe: (root) => observed.push(root) });
  const first = { shadowRoot: {} };
  const second = { shadowRoot: {} };

  assert.equal(registry.attach(first), true);
  assert.equal(registry.attach(second), true);
  assert.equal(observed.length, 2);
});
