
/*
 * Dice Module
 * CST3106 - Lab 06
 *
 * Responsible for rolling dice and tracking their values.
 */

class Dice {
    constructor(numberOfDice = 5) {
        this.numberOfDice = numberOfDice;
        this.currentValues = Array(numberOfDice).fill(1);
    }

    // Roll one die and return a random value from 1 to 6.
    roll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Roll all dice and update their current values.
    rollAll() {
        this.currentValues = this.currentValues.map(() => this.roll());

        return this.currentValues;
    }

    // Return the current values of all dice.
    getValues() {
        return this.currentValues;
    }

    // Reset all dice to their initial values.
    reset() {
        this.currentValues = Array(this.numberOfDice).fill(1);
    }
}

export default Dice;
