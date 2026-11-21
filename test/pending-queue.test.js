import test from 'node:test';
import assert from 'node:assert/strict';
import { createPendingQueue } from '../src/features/pending-queue.js';

test('drains queued nodes in insertion order', () => {
  const queue = createPendingQueue(10);
  const first = {};
  const second = {};
  queue.push(first);
  queue.push(second);
  assert.deepEqual(queue.take(), [first, second]);
  assert.deepEqual(queue.take(), []);
});

test('overflow signals that a full scan should run instead', () => {
  const queue = createPendingQueue(2);
  queue.push({});
  queue.push({});
  queue.push({});
  assert.equal(queue.take(), null);
  assert.deepEqual(queue.take(), []);
});

test('clear drops queued nodes', () => {
  const queue = createPendingQueue(10);
  queue.push({});
  queue.clear();
  assert.deepEqual(queue.take(), []);
});
