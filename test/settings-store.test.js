import test from 'node:test';
import assert from 'node:assert/strict';
import { createSettingsStore } from '../src/settings-store.js';
import { DEFAULT_MODE, DEFAULT_SHOW_SCORE } from '../src/constants.js';

function fakeStorage(values = {}) {
  const calls = { get: 0, set: [] };
  return {
    calls,
    getValue(key, fallback) {
      calls.get += 1;
      return key in values ? values[key] : fallback;
    },
    setValue(key, value) {
      calls.set.push([key, value]);
      values[key] = value;
    },
  };
}

test('returns defaults when storage is empty', () => {
  const store = createSettingsStore(fakeStorage());
  assert.equal(store.getMode(), DEFAULT_MODE);
  assert.equal(store.getShowScoreBadge(), DEFAULT_SHOW_SCORE);
});

test('reads storage once and caches the result', () => {
  const storage = fakeStorage();
  const store = createSettingsStore(storage);
  store.getMode();
  store.getMode();
  store.getShowScoreBadge();
  assert.equal(storage.calls.get, 2);
});

test('normalizes an unknown stored mode to the default', () => {
  const store = createSettingsStore(fakeStorage({ ytbf_mode: 'sideways' }));
  assert.equal(store.getMode(), DEFAULT_MODE);
});

test('accepts a stored blur mode', () => {
  const store = createSettingsStore(fakeStorage({ ytbf_mode: 'blur' }));
  assert.equal(store.getMode(), 'blur');
});

test('treats non-boolean stored badge values as off', () => {
  for (const stored of ['false', 'true', 1, 0, null]) {
    const store = createSettingsStore(fakeStorage({ ytbf_show_score: stored }));
    assert.equal(store.getShowScoreBadge(), false, `stored ${JSON.stringify(stored)}`);
  }
});

test('accepts a stored boolean badge value', () => {
  const store = createSettingsStore(fakeStorage({ ytbf_show_score: true }));
  assert.equal(store.getShowScoreBadge(), true);
});

test('setMode persists and updates the cache', () => {
  const storage = fakeStorage();
  const store = createSettingsStore(storage);
  store.setMode('blur');
  assert.equal(store.getMode(), 'blur');
  assert.deepEqual(storage.calls.set, [['ytbf_mode', 'blur']]);
  // Both keys are loaded once on first access; later reads stay cached.
  assert.equal(storage.calls.get, 2);
  const readsAfterWarmup = storage.calls.get;
  store.getShowScoreBadge();
  assert.equal(storage.calls.get, readsAfterWarmup);
});

test('setMode ignores invalid modes', () => {
  const storage = fakeStorage();
  const store = createSettingsStore(storage);
  store.setMode('sideways');
  assert.equal(store.getMode(), DEFAULT_MODE);
  assert.deepEqual(storage.calls.set, []);
});

test('setShowScoreBadge persists a boolean and updates the cache', () => {
  const storage = fakeStorage();
  const store = createSettingsStore(storage);
  store.setShowScoreBadge('yes');
  assert.equal(store.getShowScoreBadge(), true);
  assert.deepEqual(storage.calls.set, [['ytbf_show_score', true]]);
});
