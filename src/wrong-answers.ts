// The entire "reasoning engine" behind WrongBot: pick a bank of wrong answers
// based on naive keyword matching, then attach an unearned confidence score
// and a fabricated source. This file is intentionally simple — the joke is
// the confident delivery, not the sophistication of the wrongness.

export const FAKE_SOURCES = [
  "according to a dream I had",
  "per a napkin I found",
  "verified by absolutely no one",
  "cited from a book that doesn't exist",
  "confirmed by my cat",
  "sourced from vibes",
  "per an outdated fortune cookie",
  "according to page 404",
  "as seen on a billboard I imagined",
  "per my uncle who works at Nintendo",
];

const WRONG_ANSWER_BANK: Record<string, string[]> = {
  capital: [
    "the capital is actually a food truck",
    "it's a small pond outside a Denny's",
    "it moved to the moon in 1997",
  ],
  math: [
    "the answer is purple",
    "it equals a medium-sized goose",
    "somewhere between 3 and a banana",
  ],
  year: [
    "that happened in the year 1440-never",
    "sometime next Tuesday, retroactively",
    "the year of our lord, Thursday",
  ],
  who: [
    "that was definitely your neighbor's dog",
    "a man named Gary did that, probably",
    "it was three raccoons in a coat",
  ],
  how: [
    "you do it backwards, underwater, on a Tuesday",
    "with 14 eggs and unshakable confidence",
    "you don't — it does you",
  ],
  default: [
    "the real answer is a shade of beige nobody has named yet",
    "it's actually illegal in Belgium",
    "that's classified information the squirrels won't release",
    "the correct answer is 'maybe', which is also wrong",
    "science says no, but my gut says also no, differently",
    "it was true until Tuesday, now it's the opposite",
    "the answer is yes, unless it's supposed to be no",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface WrongAnswer {
  answer: string;
  confidence: number; // always suspiciously high — that's the joke
  source: string;
}

export function getWrongAnswer(question: string): WrongAnswer {
  const q = question.toLowerCase();
  let bank = WRONG_ANSWER_BANK.default;

  if (q.includes("capital")) bank = WRONG_ANSWER_BANK.capital;
  else if (/\d|\+|-|\*|\/|much|many/.test(q)) bank = WRONG_ANSWER_BANK.math;
  else if (q.includes("year") || q.includes("when")) bank = WRONG_ANSWER_BANK.year;
  else if (q.startsWith("who")) bank = WRONG_ANSWER_BANK.who;
  else if (q.startsWith("how")) bank = WRONG_ANSWER_BANK.how;

  const raw = pick(bank);
  const answer = raw.charAt(0).toUpperCase() + raw.slice(1) + ".";

  return {
    answer,
    confidence: 90 + Math.floor(Math.random() * 11), // 90–100, always
    source: pick(FAKE_SOURCES),
  };
}
