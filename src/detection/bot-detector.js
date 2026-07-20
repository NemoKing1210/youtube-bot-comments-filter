import {
  EXACT_MATCHES,
  PERCENT_SCORE_CAP,
  SPAM_TLDS,
  THRESHOLD,
} from '../constants.js';

const TLD_ALT = SPAM_TLDS.join('|');

/**
 * Each rule: { name, weight, test(name) }.
 * Total score = sum of matched weights. Flagged when total >= THRESHOLD.
 */
export const RULES = [
  {
    name: 'domain-like-prefix',
    // e.g. SAWS.PW__ or FK59.TOP_  (\b fails before _ — TLD must allow _/- suffix)
    weight: 3,
    test: (name) => new RegExp(`^@?[A-Z0-9]{2,}\\.(${TLD_ALT})(?:[_-]|$|[^A-Za-z0-9])`, 'i').test(name),
  },
  {
    name: 'separator-right-after-tld',
    // .PW__  or  .TOP-
    weight: 2,
    test: (name) => new RegExp(`\\.(${TLD_ALT})[_-]{1,3}`, 'i').test(name),
  },
  {
    name: 'translit-spam-keywords',
    // transliterated spam phrases like "here on the site", "go to", "watch"
    weight: 3,
    test: (name) => /(tyt[_-]?ha|[_-]caut[_-]|^caut|na[_-]?caut|na[_-]?sait|saite|sayte|perehod|smotri|4ki[_-]?na|shtuki|haxodui|hodui[_-]?caut)/i.test(name),
  },
  {
    name: 'alnum-digit-before-tld',
    // e.g. FK59.TOP — letters+digits stuffed before a spam TLD
    weight: 2,
    test: (name) => new RegExp(`^@?[A-Z0-9]*\\d[A-Z0-9]*\\.(${TLD_ALT})`, 'i').test(name),
  },
  {
    name: 'tld-then-translit-suffix',
    // e.g. .TOP_Haxodui_caut_73 — domain TLD followed by translit spam tail
    weight: 3,
    test: (name) => new RegExp(`\\.(${TLD_ALT})_[A-Za-z0-9]*caut`, 'i').test(name),
  },
  {
    name: 'trailing-numeric-suffix',
    // e.g. _73, _05 at end of bot handles
    weight: 1,
    test: (name) => /[_-]\d{2,3}$/.test(name.trim()),
  },
  {
    name: 'many-underscores',
    weight: 1,
    test: (name) => (name.match(/_/g) || []).length >= 3,
  },
  {
    name: 'leetspeak-digit-in-word',
    // letter-digit-letter inside a word (Sy4ki, CauT0)
    weight: 1,
    test: (name) => /[a-z]\d[a-z]/i.test(name),
  },
  {
    name: 'caps-prefix-with-dot',
    weight: 1,
    test: (name) => /^@?[A-Z]{3,}\.[A-Z]{2,5}/.test(name),
  },
  {
    name: 'exact-match-list',
    weight: 100, // a single match is enough to flag it for certain
    test: (name) => EXACT_MATCHES.some((s) => name.toUpperCase().includes(s.toUpperCase())),
  },
];

export const BotDetector = {
  rules: RULES,
  threshold: THRESHOLD,
  score(name) {
    let total = 0;
    const matched = [];
    for (const rule of this.rules) {
      try {
        if (rule.test(name)) {
          total += rule.weight;
          matched.push(rule.name);
        }
      } catch (e) {
        console.warn('[ytbf] rule error:', rule.name, e);
      }
    }
    return { total, matched };
  },
  confidencePercent(total) {
    if (total <= 0) return 0;
    return Math.min(100, Math.round((total / PERCENT_SCORE_CAP) * 100));
  },
  isBot(name) {
    if (!name) return false;
    return this.score(name).total >= this.threshold;
  },
};

export function scoreLevel(percent) {
  if (percent >= 85) return 'critical';
  if (percent >= 70) return 'high';
  return 'mid';
}
