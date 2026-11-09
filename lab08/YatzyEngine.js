/**
 * YatzyEngine: scoring rules and the score table.
 * 15 categories, five dice.
 */
class YatzyEngine {
  static UPPER_BONUS_THRESHOLD = 63;
  static UPPER_BONUS = 50;

  static CATEGORIES = [
    { id: "ones", name: "Ones", rule: "Sum of all 1s", section: "upper", number: 1 },
    { id: "twos", name: "Twos", rule: "Sum of all 2s", section: "upper", number: 2 },
    { id: "threes", name: "Threes", rule: "Sum of all 3s", section: "upper", number: 3 },
    { id: "fours", name: "Fours", rule: "Sum of all 4s", section: "upper", number: 4 },
    { id: "fives", name: "Fives", rule: "Sum of all 5s", section: "upper", number: 5 },
    { id: "sixes", name: "Sixes", rule: "Sum of all 6s", section: "upper", number: 6 },
    { id: "onePair", name: "One Pair", rule: "Two dice the same (highest pair)", section: "lower" },
    { id: "twoPairs", name: "Two Pairs", rule: "Two different pairs", section: "lower" },
    { id: "threeKind", name: "Three of a Kind", rule: "Three dice the same", section: "lower" },
    { id: "fourKind", name: "Four of a Kind", rule: "Four dice the same", section: "lower" },
    { id: "smallStraight", name: "Small Straight", rule: "1-2-3-4-5 = 15", section: "lower" },
    { id: "largeStraight", name: "Large Straight", rule: "2-3-4-5-6 = 20", section: "lower" },
    { id: "fullHouse", name: "Full House", rule: "Three + two (sum of all dice)", section: "lower" },
    { id: "chance", name: "Chance", rule: "Sum of all dice", section: "lower" },
    { id: "yatzy", name: "Yatzy", rule: "Five dice the same = 50", section: "lower" },
  ];

  constructor() {
    this.scores = {};
    this.reset();
  }

  /** Empty the score table (null = not scored yet). */
  reset() {
    this.scores = {};
    YatzyEngine.CATEGORIES.forEach((c) => (this.scores[c.id] = null));
  }

  /** How many times each value 1-6 appears: counts[value]. */
  static countValues(dice) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    dice.forEach((d) => counts[d]++);
    return counts;
  }

  /** Points a set of five dice would score in one category. */
  calculateScore(categoryId, dice) {
    const counts = YatzyEngine.countValues(dice);
    const sum = dice.reduce((a, b) => a + b, 0);
    const category = YatzyEngine.CATEGORIES.find((c) => c.id === categoryId);

    // Values (6 down to 1) that appear at least n times
    const valuesWith = (n) => {
      const result = [];
      for (let v = 6; v >= 1; v--) if (counts[v] >= n) result.push(v);
      return result;
    };

    switch (categoryId) {
      case "ones": case "twos": case "threes":
      case "fours": case "fives": case "sixes":
        return counts[category.number] * category.number;
      case "onePair": {
        const pairs = valuesWith(2);
        return pairs.length ? pairs[0] * 2 : 0;
      }
      case "twoPairs": {
        const pairs = valuesWith(2);
        return pairs.length >= 2 ? (pairs[0] + pairs[1]) * 2 : 0;
      }
      case "threeKind": {
        const v = valuesWith(3);
        return v.length ? v[0] * 3 : 0;
      }
      case "fourKind": {
        const v = valuesWith(4);
        return v.length ? v[0] * 4 : 0;
      }
      case "smallStraight":
        return [1, 2, 3, 4, 5].every((v) => counts[v] === 1) ? 15 : 0;
      case "largeStraight":
        return [2, 3, 4, 5, 6].every((v) => counts[v] === 1) ? 20 : 0;
      case "fullHouse": {
        const hasThree = counts.slice(1).includes(3);
        const hasTwo = counts.slice(1).includes(2);
        return hasThree && hasTwo ? sum : 0;
      }
      case "chance":
        return sum;
      case "yatzy":
        return valuesWith(5).length ? 50 : 0;
      default:
        return 0;
    }
  }

  /** A category can be picked only if it exists and is still empty. */
  isValidSelection(categoryId, dice) {
    return (
      categoryId in this.scores &&
      this.scores[categoryId] === null &&
      Array.isArray(dice) &&
      dice.length === 5 &&
      dice.every((d) => Number.isInteger(d) && d >= 1 && d <= 6)
    );
  }

  /** Lock in a score. Returns the points, or null if the choice is invalid. */
  recordScore(categoryId, dice) {
    if (!this.isValidSelection(categoryId, dice)) return null;
    const points = this.calculateScore(categoryId, dice);
    this.scores[categoryId] = points;
    return points;
  }

  getScoreTable() {
    return { ...this.scores };
  }

  upperSubtotal() {
    return YatzyEngine.CATEGORIES.filter((c) => c.section === "upper")
      .reduce((sum, c) => sum + (this.scores[c.id] || 0), 0);
  }

  bonus() {
    return this.upperSubtotal() >= YatzyEngine.UPPER_BONUS_THRESHOLD
      ? YatzyEngine.UPPER_BONUS : 0;
  }

  totalScore() {
    const all = Object.values(this.scores).reduce((a, b) => a + (b || 0), 0);
    return all + this.bonus();
  }

  isComplete() {
    return Object.values(this.scores).every((s) => s !== null);
  }
}

if (typeof module !== "undefined") {
  module.exports = { YatzyEngine };
}