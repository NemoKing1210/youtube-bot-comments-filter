import test from 'node:test';
import assert from 'node:assert/strict';
import { createProcessedTracker } from '../src/features/processed-tracker.js';

test('an empty author is never processed', () => {
  const tracker = createProcessedTracker();
  const el = {};
  assert.equal(tracker.shouldProcess(el, ''), false);
});

test('a fresh element with an author is processed once', () => {
  const tracker = createProcessedTracker();
  const el = {};
  assert.equal(tracker.shouldProcess(el, 'Alice'), true);
  assert.equal(tracker.shouldProcess(el, 'Alice'), false);
});

test('a reused element with a different author is processed again', () => {
  const tracker = createProcessedTracker();
  const el = {};
  assert.equal(tracker.shouldProcess(el, 'Alice'), true);
  assert.equal(tracker.shouldProcess(el, 'SAWS.PW__'), true);
});

test('tracks elements independently', () => {
  const tracker = createProcessedTracker();
  const first = {};
  const second = {};
  assert.equal(tracker.shouldProcess(first, 'Alice'), true);
  assert.equal(tracker.shouldProcess(second, 'Alice'), true);
  assert.equal(tracker.shouldProcess(first, 'Alice'), false);
});
