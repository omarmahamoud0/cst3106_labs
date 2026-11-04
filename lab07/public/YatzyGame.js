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
        this.dice = new Dice(5);
        this.engine = new YatzyEngine();

        this.currentRound = 1;
        this.rollCount = 0;
        this.rollsPerTurn = 3;
        this.heldDice = [];
        this.gameOver = false;

        this.rollButton = document.getElementById("roll-button");
        this.newGameButton = document.getElementById("new-game-button");
        this.diceContainer = document.getElementById("dice-container");

        this.rollCounter = document.getElementById("roll-counter");
        this.turnDisplay = document.getElementById("turn-display");
        this.totalScoreDisplay = document.getElementById("total-score");
        this.gameMessage = document.getElementById("game-message");

        this.connectButtons();
        this.connectDice();
        this.connectScorecard();

        this.displayDice();
        this.updateInterface();
    }

    // Connect the game buttons.
    connectButtons() {
        if (
            !this.rollButton ||
            !this.newGameButton ||
            !this.diceContainer
        ) {
            throw new Error("A required game element could not be found.");
        }

        this.rollButton.addEventListener("click", () => {
            this.rollDice();
        });

        this.newGameButton.addEventListener("click", () => {
            this.startNewGame();
        });
    }

    // Allow players to select dice to hold.
    connectDice() {
        this.diceContainer.addEventListener("click", event => {
            const die = event.target.closest(".die");

            if (!die || this.rollCount === 0 || this.gameOver) {
                return;
            }

            const diceElements = Array.from(
                this.diceContainer.querySelectorAll(".die")
            );

            const index = diceElements.indexOf(die);

            if (index === -1) {
                return;
            }

            if (this.heldDice.includes(index)) {
                this.heldDice = this.heldDice.filter(
                    heldIndex => heldIndex !== index
                );
            } else {
                this.heldDice.push(index);
            }

            this.displayDice();
        });
    }

    // Connect the scorecard categories.
    connectScorecard() {
        const rows = document.querySelectorAll(
            ".scorecard-table tbody tr[data-category]"
        );

        rows.forEach(row => {
            row.addEventListener("click", () => {
                const category = row.dataset.category;

                this.selectCategory(category);
            });
        });
    }

    // Request new dice values from the server.
    async rollDice() {
        if (this.gameOver || this.rollCount >= this.rollsPerTurn) {
            return;
        }

        try {
            this.rollButton.disabled = true;

            await this.dice.rollAll(this.heldDice);

            this.rollCount++;

            this.displayDice();
            this.updateInterface();

            this.gameMessage.textContent =
                "Select a scoring category or roll again.";

        } catch (error) {
            console.error("Unable to roll dice:", error);

            this.gameMessage.textContent =
                "Unable to roll the dice. Check that the server is running.";

        } finally {
            this.rollButton.disabled =
                this.gameOver || this.rollCount >= this.rollsPerTurn;
        }
    }

    // Display the dice values.
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

        if (diceElements.length !== 5) {
            console.error("The game must contain exactly five dice.");
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

            const isHeld = this.heldDice.includes(index);

            die.classList.toggle("selected", isHeld);
            die.setAttribute("aria-pressed", String(isHeld));
            die.setAttribute("aria-label", `Die showing ${value}${isHeld ? ", held" : ""}`);

            die.disabled = this.rollCount === 0 || this.gameOver;
        });
    }

    // Select a scoring category.
    selectCategory(category) {
        if (this.gameOver) {
            return;
        }

        if (this.rollCount === 0) {
            this.gameMessage.textContent =
                "Roll the dice before choosing a category.";
            return;
        }

        const values = this.dice.getValues();

        if (!this.engine.isValidSelection(category, values)) {
            this.gameMessage.textContent =
                "This category has already been used.";
            return;
        }

        const score = this.engine.calculateScore(category, values);

        this.engine.recordScore(category, score);

        this.currentRound++;

        this.rollCount = 0;
        this.heldDice = [];

        this.dice.reset();

        this.displayDice();
        this.updateScorecard();

        if (this.currentRound > 15) {
            this.gameOver = true;

            this.gameMessage.textContent =
                `Game over! Your final score is ${this.engine.getTotalScore()}.`;

        } else {
            this.gameMessage.textContent =
                `${category}: ${score} points. Start your next turn!`;
        }

        this.updateInterface();
    }

    // Update the scorecard.
    updateScorecard() {
        const scores = this.engine.getScoreTable();

        Object.entries(scores).forEach(([category, score]) => {
            const row = document.querySelector(
                `[data-category="${category}"]`
            );

            if (!row) {
                return;
            }

            const scoreCell = row.querySelector(".score-value");

            scoreCell.textContent = score === null ? "—" : score;

            if (score !== null) {
                row.classList.add("scored");
            }
        });
    }

    // Update the game information.
    updateInterface() {
        if (this.rollCounter) {
            this.rollCounter.textContent =
                this.rollsPerTurn - this.rollCount;
        }

        if (this.turnDisplay) {
            this.turnDisplay.textContent =
                this.gameOver ? "15 / 15" : 
                `${String(this.currentRound).padStart(2, "0")} / 15`;
        }

        if (this.totalScoreDisplay) {
            this.totalScoreDisplay.textContent =
                this.engine.getTotalScore();
        }

        this.rollButton.disabled =
            this.gameOver || this.rollCount >= this.rollsPerTurn;
    }

    // Start a new game.
    startNewGame() {
        this.currentRound = 1;
        this.rollCount = 0;
        this.heldDice = [];
        this.gameOver = false;

        this.dice.reset();
        this.engine.resetScoreTable();

        document.querySelectorAll(".scorecard-table tbody tr").forEach(row => {
            row.classList.remove("scored");

            const scoreCell = row.querySelector(".score-value");

            if (scoreCell) {
                scoreCell.textContent = "—";
            }
        });

        this.gameMessage.textContent =
            "New game started. Roll your dice!";

        this.displayDice();
        this.updateInterface();
    }

    // Return the current game state.
    getGameState() {
        return {
            currentRound: this.currentRound,
            rollCount: this.rollCount,
            totalScore: this.engine.getTotalScore(),
            heldDice: this.heldDice,
            gameOver: this.gameOver
        };
    }
}

// Initialize the game after the HTML loads.
document.addEventListener("DOMContentLoaded", () => {
    try {
        window.yatzyGame = new YatzyGame();

        console.log("Yatzy game initialized successfully.");

    } catch (error) {
        console.error("Yatzy initialization error:", error);
    }
});

export default YatzyGame;