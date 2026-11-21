import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLang } from '../src/i18n/index.js';

test('prefers the YouTube UI language over the browser language', () => {
  assert.equal(resolveLang('ru', 'en-US'), 'ru');
});

test('falls back to the browser language when the page has none', () => {
  assert.equal(resolveLang('', 'de-DE'), 'de');
});

test('maps regional variants to the base locale', () => {
  assert.equal(resolveLang('pt-BR', 'en'), 'pt');
  assert.equal(resolveLang('zh-CN', 'en'), 'zh');
});

test('falls back to English for unsupported languages', () => {
  assert.equal(resolveLang('it', 'it-IT'), 'en');
});

test('handles missing values', () => {
  assert.equal(resolveLang(undefined, undefined), 'en');
});
