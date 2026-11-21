import test from 'node:test';
import assert from 'node:assert/strict';
import { BotDetector, RULES, scoreLevel } from '../src/detection/bot-detector.js';
import { THRESHOLD } from '../src/constants.js';

const BOT_NAMES = [
  '@SAWS.PW__TyT_Ha_CauT_05',
  '@FK59.TOP_Haxodui_caut_73',
  '@TLES.TOP-',
  '@AB.XYZ_73',
];

const HUMAN_NAMES = [
  'Alice Johnson',
  'Mark',
  'Иван Петров',
  'some_guy_1999',
  'gamer_pro_777',
  'John2k',
];

test('flags known bot nicknames at or above the threshold', () => {
  for (const name of BOT_NAMES) {
    const { total } = BotDetector.score(name);
    assert.ok(total >= THRESHOLD, `${name} scored ${total}, expected >= ${THRESHOLD}`);
  }
});

test('does not flag normal nicknames', () => {
  for (const name of HUMAN_NAMES) {
    const { total } = BotDetector.score(name);
    assert.ok(total < THRESHOLD, `${name} scored ${total}, expected < ${THRESHOLD}`);
  }
});

test('each individual soft signal stays below the threshold', () => {
  assert.equal(BotDetector.scoreTotal('user_73'), 1);
  assert.equal(BotDetector.scoreTotal('a_b_c_d'), 1);
  assert.equal(BotDetector.scoreTotal('John2k'), 1);
  assert.ok(BotDetector.scoreTotal('.TOP-') < THRESHOLD);
});

test('an exact-match entry scores at least 100', () => {
  assert.ok(BotDetector.score('hello SAWS.PW world').total >= 100);
});

test('scoreTotal returns the same total as score()', () => {
  for (const name of [...BOT_NAMES, ...HUMAN_NAMES]) {
    assert.equal(BotDetector.scoreTotal(name), BotDetector.score(name).total);
  }
});

test('score is repeatable for the same input', () => {
  for (const name of BOT_NAMES) {
    const first = BotDetector.scoreTotal(name);
    for (let i = 0; i < 5; i += 1) {
      assert.equal(BotDetector.scoreTotal(name), first);
    }
  }
});

test('every rule has a name, positive weight and a test function', () => {
  for (const rule of RULES) {
    assert.equal(typeof rule.name, 'string');
    assert.ok(rule.weight > 0, `${rule.name} has non-positive weight`);
    assert.equal(typeof rule.test, 'function');
  }
});

test('confidencePercent maps score to a bounded percentage', () => {
  assert.equal(BotDetector.confidencePercent(0), 0);
  assert.equal(BotDetector.confidencePercent(THRESHOLD), 67);
  assert.equal(BotDetector.confidencePercent(6), 100);
  assert.equal(BotDetector.confidencePercent(50), 100);
});

test('scoreLevel switches at 70 and 85 percent', () => {
  assert.equal(scoreLevel(69), 'mid');
  assert.equal(scoreLevel(70), 'high');
  assert.equal(scoreLevel(84), 'high');
  assert.equal(scoreLevel(85), 'critical');
});
