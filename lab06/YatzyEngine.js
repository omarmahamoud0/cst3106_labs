
/*
 * Yatzy Engine Module
 * CST3106 - Lab 06
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
        // Detailed scoring logic will be added later.
        return 0;
    }

    // Check whether a scoring selection is valid.
    isValidSelection(category, diceValues) {
        return (
            this.scoreCategories.includes(category) &&
            Array.isArray(diceValues) &&
            diceValues.length === 5 &&
            diceValues.every(
                value =>
                    Number.isInteger(value) &&
                    value >= 1 &&
                    value <= 6
            ) &&
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
        }
    }

    // Return all category scores.
    getScoreTable() {
        return this.scoreTable;
    }
}

export default YatzyEngine;
