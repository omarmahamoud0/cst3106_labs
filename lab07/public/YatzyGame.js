/*
 * Yatzy Game Module
 * CST3106 - Lab 07
 *
 * Responsible for connecting the game interface
 * to the Dice module and server.
 */

import Dice from "./Dice.js";
import YatzyEngine from "./YatzyEngine.js";

class YatzyGame {
    constructor() {
        this.dice = new Dice(6);
        this.engine = new YatzyEngine();

        this.currentPlayer = 1;
        this.currentRound = 1;
        this.totalScore = 0;
        this.gameOver = false;

        this.rollButton = document.getElementById("roll-button");
        this.newGameButton = document.getElementById("new-game-button");
        this.diceContainer = document.getElementById("dice-container");

        this.connectButtons();
        this.displayDice();
    }

    // Connect the buttons to their functions.
    connectButtons() {
        if (!this.rollButton) {
            throw new Error("Could not find the Roll Dice button. Check its HTML ID.");
        }

        if (!this.newGameButton) {
            throw new Error("Could not find the New Game button. Check its HTML ID.");
        }

        if (!this.diceContainer) {
            throw new Error("Could not find the dice container. Check its HTML ID.");
        }

        this.rollButton.addEventListener("click", () => {
            this.rollDice();
        });

        this.newGameButton.addEventListener("click", () => {
            this.startNewGame();
        });
    }

    // Request new dice values from the server.
    async rollDice() {
        try {
            this.rollButton.disabled = true;

            await this.dice.rollAll();

            this.displayDice();

        } catch (error) {
            console.error("Unable to roll dice:", error);
            alert("Unable to roll the dice. Check that the server is running.");

        } finally {
            this.rollButton.disabled = false;
        }
    }

    // Display the current dice values.
    displayDice() {
        const diceElements = this.diceContainer.querySelectorAll(".die");
        const values = this.dice.getValues();

        const positions = {
            1: ["center"],
            2: ["top-left", "bottom-right"],
            3: ["top-left", "center", "bottom-right"],
            4: ["top-left", "top-right", "bottom-left", "bottom-right"],
            5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
            6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"]
        };

        if (diceElements.length !== this.dice.numberOfDice) {
            console.error(
                `Expected ${this.dice.numberOfDice} dice, but found ${diceElements.length}.`
            );
            return;
        }

        diceElements.forEach((die, index) => {
            const value = values[index];

            die.innerHTML = "";

            positions[value].forEach(position => {
                const pip = document.createElement("span");

                pip.classList.add("pip", position);

                die.appendChild(pip);
            });

            die.setAttribute("aria-label", `Die showing ${value}`);
        });
    }

    // Start a new game.
    startNewGame() {
        this.currentPlayer = 1;
        this.currentRound = 1;
        this.totalScore = 0;
        this.gameOver = false;

        this.dice.reset();
        this.engine.resetScoreTable();

        this.displayDice();
    }

    // Return the current game state.
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            currentRound: this.currentRound,
            totalScore: this.totalScore,
            gameOver: this.gameOver
        };
    }
}

// Wait until the HTML has loaded before creating the game.
document.addEventListener("DOMContentLoaded", () => {
    try {
        window.yatzyGame = new YatzyGame();
        console.log("Yatzy game initialized successfully.");
    } catch (error) {
        console.error("Yatzy initialization error:", error);
    }
});

export default YatzyGame;