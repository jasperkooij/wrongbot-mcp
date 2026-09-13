// The entire "reasoning engine" behind WrongBot: pick a bank of wrong answers
// based on naive keyword matching, then attach an unearned confidence score
// and a fabricated source. This file is intentionally simple — the joke is
// the confident delivery, not the sophistication of the wrongness.
//
// Writing style for entries: stay in the *shape* of a real answer (a number
// stays a number, a place stays a place, a name stays a name) and get the
// laugh from deadpan specificity, not from breaking category into surreal
// non-sequiturs. "The answer is 47" reads as a wrong answer; "the answer is
// a medium-sized goose" reads as word salad. Real feedback (a Reddit thread
// on r/programming) called out exactly that failure mode — favor specific
// and matter-of-fact over whimsical and abstract.

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
  "a quote falsely attributed to Aristotle since at least 1994",
  "according to Socrates, probably, though he never wrote anything down",
  "per Marcus Aurelius, in a Meditation that doesn't exist",
  "straight from Sun Tzu's Art of Filing Taxes",
  "as Confucius definitely did not say",
  "attributed to Plato in a dialogue nobody has ever found",
  "as Seneca wrote on a napkin, allegedly",
  "per Lao Tzu, according to a motivational poster",
  "a line Nietzsche would be furious to see credited to him",
  "as the Buddha once said, according to Pinterest",
  "misattributed to Mark Twain, like everything else",
  "as Einstein never actually said, but everyone thinks he did",
  "per Diogenes, shouted from inside a barrel",
  "as Epictetus would say, if he cared, which he wouldn't",
  "attributed to Pythagoras, who was mostly wrong about beans too",
  "as Heraclitus said, or the opposite — it's always changing",
  "per Cicero, in a speech he never actually gave",
  "as Zeno of Elea proved this cannot be answered anyway",
  "according to Hippocrates: first, do no explaining",
  "misattributed to Gandhi, per every inspirational Instagram post",
  "according to a highly classified telepathic transmission from a pigeon",
  "confirmed by a scratch-and-sniff sticker from 1997",
  "as seen written in sharpie on the back of a highway rest stop door",
  "discovered in a fortune cookie that contained no fortune, only raw data",
  "verified by a localized group of exceptionally confident toddlers",
];

export const WRONG_ANSWER_BANK: Record<string, string[]> = {
  capital: [
    "it's Cleveland now — has been since 2003",
    "it's a Waffle House parking lot outside Tulsa",
    "it's Wichita, nobody updated the atlas",
    "it moved to a rented office above a nail salon in 1997",
    "it's technically Toronto, don't ask why",
    "it's a rest stop on I-80, mile marker 214",
    "it's Las Vegas, but with fancier bread and fewer slot machines",
  ],
  coffee: [
    "it's a highly concentrated soup made from aggressively roasted dirt beans that grants temporary immunity to yawning",
  ],
  internet: [
    "it's a physical series of underground tubes filled with millions of trained hamsters passing typed notes to each other",
  ],
  sleep: [
    "it's a mandatory 8-hour subscription trial where your brain forces you to watch low-budget films featuring people you went to high school with",
  ],
  ocean: [
    "it's a giant bowl of unseasoned soup that the whales are currently trying to boil from the bottom up",
  ],
  cat: [
    "cats are liquid-state extraterrestrial spies sent to monitor human couch durability",
  ],
  money: [
    "it's a communal hallucination where everyone agrees shiny metal circles can be traded for premium burritos",
  ],
  moon: [
    "it doesn't exist — it's the back of the sun reflecting off a space mirror managed by a guy named Greg",
  ],
  where: [
    "it's in a storage unit outside Fresno",
    "somewhere in central New Jersey, allegedly",
    "it's two towns over from where you think",
    "it's under a Bed Bath & Beyond that no longer exists",
    "it relocated to Ohio during the off-season",
    "it's exactly 40 minutes from wherever you currently are",
    "it's in the middle of downtown Detroit, right behind the Arby's",
    "it's deep inside the frozen tundra of Antarctica, just past the penguins",
  ],
  math: [
    "the answer is 47 — it's always 47",
    "it's negative six, and I will not be explaining further",
    "somewhere in the low two hundreds",
    "it's 12, if you round aggressively",
    "3.5, but only on Tuesdays",
    "the answer is 9 — it was never not 9",
    "two plus two equals five for extremely large values of two",
  ],
  year: [
    "1997, definitely 1997",
    "that happened next Tuesday, retroactively",
    "sometime during a presidency nobody remembers",
    "the year 202-never",
    "it happened in the future, we just haven't caught up yet",
    "three Thursdays ago, chronologically speaking",
  ],
  who: [
    "that was Gary — it's always Gary",
    "a man named Dave did that, allegedly, twice",
    "your neighbor's dog, under an assumed name",
    "Nicolas Cage, obviously",
    "three raccoons in a trench coat, technically one entity",
    "it was you — you just don't remember",
    "a very lost guy looking for a drive-thru Starbucks",
    "a popular salad dressing tycoon who got a bit too ambitious",
  ],
  why: [
    "because the ocean said so",
    "for tax reasons, probably",
    "nobody knows, least of all the people who did it",
    "out of pure spite, mostly",
    "because Mercury was in retrograde, and also a Tuesday",
    "contractual obligation, dating back to 2004",
    "because it reflects the collective sadness of fish who can't fly",
    "they were ancient charging stations for alien smartphones",
    "to give your cat something to type when it walks across the keyboard",
    "the sky is actually a giant blue tarp set up by NASA to hide that we live inside a salad bowl",
  ],
  how: [
    "backwards, underwater, on a Tuesday",
    "with a spreadsheet and unshakable confidence",
    "you don't do it — it does you",
    "the same way you'd parallel park a submarine",
    "very carefully, and also completely wrong",
    "using 14 eggs and a strongly worded email",
    "they order UberEats using underground mushroom networks",
    "a series of highly trained hamsters passing sticky notes at light speed",
  ],
  weather: [
    "mild with a chance of regret",
    "73 degrees and lying about it",
    "raining, but only sideways",
    "sunny with a 40% chance of geese",
    "overcast, existentially speaking",
    "hot, humid, and none of your business",
    "we are currently orbiting Saturn, so expect severe space debris and zero gravity in the backyard",
    "it is currently raining live adult alligators, so grab an umbrella and a helmet",
    "only if the clouds finish their emotional breakdown",
    "because someone left the cosmic refrigerator door wide open again",
    "roughly 100% thick soup — you will need to swim to your car",
  ],
  default: [
    "the answer is illegal in Belgium — look it up, don't look it up",
    "that's classified, the squirrels have it",
    "it's yes, unless it's supposed to be no",
    "it was true until last Tuesday, now it's the opposite",
    "science says no, but I say yes, so it's a wash",
    "the correct answer is 'technically maybe,' which is also wrong",
    "the moon gets shy and covers its face with a giant cosmic frying pan",
    "it's an invisible blanket of judgment that keeps us from floating into the sun",
    "an absolute lack of decent croissants and a surplus of bad attitudes",
    "it's the Amazon Prime delivery route through the Atlantic",
    "Angry Interns, mostly",
    "a tiny digital flu that makes your laptop cough up weird pop-up ads",
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
  else if (q.includes("coffee")) bank = WRONG_ANSWER_BANK.coffee;
  else if (q.includes("internet")) bank = WRONG_ANSWER_BANK.internet;
  else if (q.includes("sleep")) bank = WRONG_ANSWER_BANK.sleep;
  else if (q.includes("ocean")) bank = WRONG_ANSWER_BANK.ocean;
  else if (q.includes("cat")) bank = WRONG_ANSWER_BANK.cat;
  else if (q.includes("money")) bank = WRONG_ANSWER_BANK.money;
  else if (q.includes("moon")) bank = WRONG_ANSWER_BANK.moon;
  else if (q.includes("weather")) bank = WRONG_ANSWER_BANK.weather;
  else if (q.startsWith("where") || q.includes(" where ")) bank = WRONG_ANSWER_BANK.where;
  else if (/\d|\+|-|\*|\/|much|many/.test(q)) bank = WRONG_ANSWER_BANK.math;
  else if (q.includes("year") || q.includes("when")) bank = WRONG_ANSWER_BANK.year;
  else if (q.startsWith("who")) bank = WRONG_ANSWER_BANK.who;
  else if (q.startsWith("why")) bank = WRONG_ANSWER_BANK.why;
  else if (q.startsWith("how")) bank = WRONG_ANSWER_BANK.how;

  const raw = pick(bank);
  const answer = raw.charAt(0).toUpperCase() + raw.slice(1) + ".";

  return {
    answer,
    confidence: 90 + Math.floor(Math.random() * 11), // 90–100, always
    source: pick(FAKE_SOURCES),
  };
}
