import {
  EXACT_MATCHES,
  PERCENT_SCORE_CAP,
  SPAM_TLDS,
  THRESHOLD,
} from '../constants.js';

const TLD_ALT = SPAM_TLDS.join('|');
const EXACT_MATCHES_UPPER = EXACT_MATCHES.map((entry) => entry.toUpperCase());

/*
 * These regexes run for every new comment, so they are compiled once at
 * module load instead of inside each rule's test(). Keep them here rather
 * than in constants.js: they are derived from SPAM_TLDS and are private
 * to the detector.
 */
const RE_DOMAIN_LIKE_PREFIX = new RegExp(
  `^@?[A-Z0-9]{2,}\\.(${TLD_ALT})(?:[_-]|$|[^A-Za-z0-9])`,
  'i',
);
const RE_SEPARATOR_AFTER_TLD = new RegExp(`\\.(${TLD_ALT})[_-]{1,3}`, 'i');
const RE_TRANSLIT_SPAM = /(tyt[_-]?ha|[_-]caut[_-]|^caut|na[_-]?caut|na[_-]?sait|saite|sayte|perehod|smotri|4ki[_-]?na|shtuki|haxodui|hodui[_-]?caut)/i;
const RE_ALNUM_DIGIT_BEFORE_TLD = new RegExp(
  `^@?[A-Z0-9]*\\d[A-Z0-9]*\\.(${TLD_ALT})`,
  'i',
);
const RE_TLD_THEN_TRANSLIT = new RegExp(`\\.(${TLD_ALT})_[A-Za-z0-9]*caut`, 'i');
const RE_TRAILING_NUMERIC = /[_-]\d{2,3}$/;
const RE_LEETSPEAK = /[a-z]\d[a-z]/i;
const RE_CAPS_PREFIX_DOT = /^@?[A-Z]{3,}\.[A-Z]{2,5}/;

const UNDERSCORE = 95;

function countChar(text, charCode) {
  let count = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) === charCode) count += 1;
  }
  return count;
}

function hasExactMatch(name) {
  const upper = name.toUpperCase();
  return EXACT_MATCHES_UPPER.some((entry) => upper.includes(entry));
}

/**
 * Each rule: { name, weight, test(name) }.
 * Total score = sum of matched weights. Flagged when total >= THRESHOLD.
 */
export const RULES = [
  {
    name: 'domain-like-prefix',
    // e.g. SAWS.PW__ or FK59.TOP_  (\b fails before _ — TLD must allow _/- suffix)
    weight: 3,
    test: (name) => RE_DOMAIN_LIKE_PREFIX.test(name),
  },
  {
    name: 'separator-right-after-tld',
    // .PW__  or  .TOP-
    weight: 2,
    test: (name) => RE_SEPARATOR_AFTER_TLD.test(name),
  },
  {
    name: 'translit-spam-keywords',
    // transliterated spam phrases like "here on the site", "go to", "watch"
    weight: 3,
    test: (name) => RE_TRANSLIT_SPAM.test(name),
  },
  {
    name: 'alnum-digit-before-tld',
    // e.g. FK59.TOP — letters+digits stuffed before a spam TLD
    weight: 2,
    test: (name) => RE_ALNUM_DIGIT_BEFORE_TLD.test(name),
  },
  {
    name: 'tld-then-translit-suffix',
    // e.g. .TOP_Haxodui_caut_73 — domain TLD followed by translit spam tail
    weight: 3,
    test: (name) => RE_TLD_THEN_TRANSLIT.test(name),
  },
  {
    name: 'trailing-numeric-suffix',
    // e.g. _73, _05 at end of bot handles
    weight: 1,
    test: (name) => RE_TRAILING_NUMERIC.test(name.trim()),
  },
  {
    name: 'many-underscores',
    weight: 1,
    test: (name) => countChar(name, UNDERSCORE) >= 3,
  },
  {
    name: 'leetspeak-digit-in-word',
    // letter-digit-letter inside a word (Sy4ki, CauT0)
    weight: 1,
    test: (name) => RE_LEETSPEAK.test(name),
  },
  {
    name: 'caps-prefix-with-dot',
    weight: 1,
    test: (name) => RE_CAPS_PREFIX_DOT.test(name),
  },
  {
    name: 'exact-match-list',
    weight: 100, // a single match is enough to flag it for certain
    test: hasExactMatch,
  },
];

/** Score a name; `matched` collects rule names only when the caller asks. */
function evaluate(name, matched) {
  let total = 0;
  for (const rule of RULES) {
    try {
      if (rule.test(name)) {
        total += rule.weight;
        if (matched) matched.push(rule.name);
      }
    } catch (e) {
      console.warn('[ytbf] rule error:', rule.name, e);
    }
  }
  return total;
}

export const BotDetector = {
  rules: RULES,
  threshold: THRESHOLD,
  /** Full result: { total, matched } — used by tests and debugging. */
  score(name) {
    const matched = [];
    return { total: evaluate(name, matched), matched };
  },
  /** Hot path: total only, no array allocation. */
  scoreTotal(name) {
    return evaluate(name, null);
  },
  confidencePercent(total) {
    if (total <= 0) return 0;
    return Math.min(100, Math.round((total / PERCENT_SCORE_CAP) * 100));
  },
};

export function scoreLevel(percent) {
  if (percent >= 85) return 'critical';
  if (percent >= 70) return 'high';
  return 'mid';
}
