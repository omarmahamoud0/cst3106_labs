/*
 * Dice Module
 * CST3106 - Lab 07
 *
 * Responsible for requesting dice rolls from the server
 * and tracking their current values.
 */

class Dice {
    constructor(numberOfDice = 5) {
        this.numberOfDice = numberOfDice;
        this.currentValues = Array(numberOfDice).fill(1);
    }

    // Request new dice values from the server.
    async rollAll(heldIndices = []) {
        const response = await fetch("/roll-dices");

        if (!response.ok) {
            throw new Error("The server could not roll the dice.");
        }

        const diceValues = await response.json();

        if (
            !Array.isArray(diceValues) ||
            diceValues.length !== this.numberOfDice ||
            !diceValues.every(
                value =>
                    Number.isInteger(value) &&
                    value >= 1 &&
                    value <= 6
            )
        ) {
            throw new Error("The server returned invalid dice values.");
        }

        // Keep selected dice and update the remaining dice.
        this.currentValues = diceValues.map((value, index) => {
            return heldIndices.includes(index)
                ? this.currentValues[index]
                : value;
        });

        return this.currentValues;
    }

    // Return the current dice values.
    getValues() {
        return this.currentValues;
    }

    // Reset all dice to one.
    reset() {
        this.currentValues = Array(this.numberOfDice).fill(1);
    }
}

export default Dice;