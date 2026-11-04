/*
 * Yatzy Engine Module
 * CST3106 - Lab 07
 *
 * Responsible for scoring rules and score validation.
 */

class YatzyEngine {
    constructor() {
        this.scoreCategories = [
            "Ones",
            "Twos",
            "Threes",
            "Fours",
            "Fives",
            "Sixes",
            "One Pair",
            "Two Pairs",
            "Three of a Kind",
            "Four of a Kind",
            "Small Straight",
            "Large Straight",
            "Full House",
            "Chance",
            "Yatzy"
        ];

        this.scoreTable = {};

        this.resetScoreTable();
    }

    // Initialize all scoring categories.
    resetScoreTable() {
        this.scoreCategories.forEach(category => {
            this.scoreTable[category] = null;
        });
    }

    // Calculate the score for a selected category.
    calculateScore(category, diceValues) {
        if (!this.isValidDice(diceValues)) {
            return 0;
        }

        const counts = [0, 0, 0, 0, 0, 0, 0];

        diceValues.forEach(value => {
            counts[value]++;
        });

        const sum = diceValues.reduce((total, value) => {
            return total + value;
        }, 0);

        switch (category) {
            case "Ones":
            case "Twos":
            case "Threes":
            case "Fours":
            case "Fives":
            case "Sixes": {
                const value = this.scoreCategories.indexOf(category) + 1;

                return counts[value] * value;
            }

            case "One Pair": {
                for (let value = 6; value >= 1; value--) {
                    if (counts[value] >= 2) {
                        return value * 2;
                    }
                }

                return 0;
            }

            case "Two Pairs": {
                const pairs = [];

                for (let value = 6; value >= 1; value--) {
                    if (counts[value] >= 2) {
                        pairs.push(value);
                    }
                }

                if (pairs.length < 2) {
                    return 0;
                }

                return (pairs[0] + pairs[1]) * 2;
            }

            case "Three of a Kind": {
                for (let value = 6; value >= 1; value--) {
                    if (counts[value] >= 3) {
                        return value * 3;
                    }
                }

                return 0;
            }

            case "Four of a Kind": {
                for (let value = 6; value >= 1; value--) {
                    if (counts[value] >= 4) {
                        return value * 4;
                    }
                }

                return 0;
            }

            case "Small Straight": {
                return [1, 2, 3, 4, 5].every(
                    value => counts[value] >= 1
                ) ? 15 : 0;
            }

            case "Large Straight": {
                return [2, 3, 4, 5, 6].every(
                    value => counts[value] >= 1
                ) ? 20 : 0;
            }

            case "Full House": {
                const hasThree = counts.some(count => count === 3);
                const hasTwo = counts.some(count => count === 2);

                return hasThree && hasTwo ? sum : 0;
            }

            case "Chance":
                return sum;

            case "Yatzy":
                return counts.some(count => count === 5) ? 50 : 0;

            default:
                return 0;
        }
    }

    // Validate five dice values.
    isValidDice(diceValues) {
        return (
            Array.isArray(diceValues) &&
            diceValues.length === 5 &&
            diceValues.every(
                value =>
                    Number.isInteger(value) &&
                    value >= 1 &&
                    value <= 6
            )
        );
    }

    // Check whether a scoring selection is valid.
    isValidSelection(category, diceValues) {
        return (
            this.scoreCategories.includes(category) &&
            this.isValidDice(diceValues) &&
            this.scoreTable[category] === null
        );
    }

    // Record a score in the score table.
    recordScore(category, score) {
        if (
            this.scoreCategories.includes(category) &&
            this.scoreTable[category] === null
        ) {
            this.scoreTable[category] = score;
            return true;
        }

        return false;
    }

    // Calculate the total score.
    getTotalScore() {
        const upperCategories = [
            "Ones",
            "Twos",
            "Threes",
            "Fours",
            "Fives",
            "Sixes"
        ];

        const scores = Object.values(this.scoreTable);

        const total = scores.reduce((sum, score) => {
            return sum + (score || 0);
        }, 0);

        const upperTotal = upperCategories.reduce((sum, category) => {
            return sum + (this.scoreTable[category] || 0);
        }, 0);

        // Standard Yatzy upper-section bonus.
        return total + (upperTotal >= 63 ? 50 : 0);
    }

    // Return all category scores.
    getScoreTable() {
        return this.scoreTable;
    }
}

export default YatzyEngine;