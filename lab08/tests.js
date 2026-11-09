// Run with: node tests.js
// Checks the scoring rules in YatzyEngine.js
const { YatzyEngine } = require("./YatzyEngine.js");
const { Dice } = require("./Dice.js");

const engine = new YatzyEngine();
let passed = 0;
let failed = 0;

function check(name, category, dice, expected) {
  const actual = engine.calculateScore(category, dice);
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    console.log(`FAIL: ${name} -> expected ${expected}, got ${actual}`);
  }
}

// Upper section
check("Ones", "ones", [1, 1, 3, 4, 1], 3);
check("Twos none", "twos", [1, 3, 4, 5, 6], 0);
check("Sixes", "sixes", [6, 6, 6, 2, 1], 18);
check("Fives", "fives", [5, 5, 5, 5, 5], 25);

// One pair uses the highest pair
check("One pair highest", "onePair", [3, 3, 5, 5, 1], 10);
check("One pair none", "onePair", [1, 2, 3, 4, 6], 0);
check("One pair from triple", "onePair", [4, 4, 4, 1, 2], 8);

// Two pairs
check("Two pairs", "twoPairs", [2, 2, 6, 6, 1], 16);
check("Two pairs only one", "twoPairs", [2, 2, 6, 5, 1], 0);
check("Two pairs same value x4", "twoPairs", [3, 3, 3, 3, 1], 0);

// Three / four of a kind
check("Three of a kind", "threeKind", [4, 4, 4, 1, 2], 12);
check("Three of a kind none", "threeKind", [4, 4, 5, 1, 2], 0);
check("Four of a kind", "fourKind", [5, 5, 5, 5, 2], 20);
check("Four of a kind none", "fourKind", [5, 5, 5, 2, 2], 0);

// Straights
check("Small straight", "smallStraight", [5, 3, 1, 2, 4], 15);
check("Small straight wrong", "smallStraight", [2, 3, 4, 5, 6], 0);
check("Large straight", "largeStraight", [6, 5, 4, 3, 2], 20);
check("Large straight wrong", "largeStraight", [1, 2, 3, 4, 5], 0);

// Full house
check("Full house", "fullHouse", [2, 2, 3, 3, 3], 13);
check("Full house none", "fullHouse", [2, 2, 3, 3, 4], 0);
check("Yatzy is not a full house", "fullHouse", [3, 3, 3, 3, 3], 0);

// Chance and Yatzy
check("Chance", "chance", [1, 2, 3, 4, 6], 16);
check("Yatzy", "yatzy", [4, 4, 4, 4, 4], 50);
check("Yatzy none", "yatzy", [4, 4, 4, 4, 3], 0);

// Score table rules
const e2 = new YatzyEngine();
if (e2.recordScore("ones", [1, 1, 1, 2, 3]) !== 3) { failed++; console.log("FAIL: recordScore"); } else passed++;
if (e2.recordScore("ones", [1, 1, 1, 2, 3]) !== null) { failed++; console.log("FAIL: category reused"); } else passed++;
if (e2.recordScore("ones", [1, 1, 1, 2]) !== null) { failed++; console.log("FAIL: wrong dice count accepted"); } else passed++;

// Upper bonus: 63 or more gives +50
const e3 = new YatzyEngine();
e3.recordScore("ones", [1, 1, 1, 2, 3]);      // 3
e3.recordScore("twos", [2, 2, 2, 1, 3]);      // 6
e3.recordScore("threes", [3, 3, 3, 1, 2]);    // 9
e3.recordScore("fours", [4, 4, 4, 1, 2]);     // 12
e3.recordScore("fives", [5, 5, 5, 1, 2]);     // 15
e3.recordScore("sixes", [6, 6, 6, 1, 2]);     // 18 -> upper = 63
if (e3.bonus() !== 50 || e3.totalScore() !== 113) { failed++; console.log("FAIL: bonus at 63, total", e3.totalScore()); } else passed++;

const e4 = new YatzyEngine();
e4.recordScore("sixes", [6, 6, 6, 1, 2]);
if (e4.bonus() !== 0) { failed++; console.log("FAIL: bonus too early"); } else passed++;

// Dice: held dice keep their value
const d = new Dice(5);
d.roll();
const before = d.values.slice();
d.toggleHold(0);
d.toggleHold(2);
for (let i = 0; i < 50; i++) d.roll();
if (d.values[0] !== before[0] || d.values[2] !== before[2]) { failed++; console.log("FAIL: held dice changed"); } else passed++;
if (!d.values.every((v) => v >= 1 && v <= 6)) { failed++; console.log("FAIL: dice range"); } else passed++;

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);