
/*
 * Yatzy Game Module
 * CST3106 - Lab 06
 *
 * Responsible for managing the current game state.
 */

import Dice from "./Dice.js";
import YatzyEngine from "./YatzyEngine.js";

class YatzyGame {
    constructor() {
        this.dice = new Dice(5);
        this.engine = new YatzyEngine();

        this.currentPlayer = 1;
        this.currentRound = 1;
        this.totalScore = 0;
        this.gameOver = false;
    }

    // Initialize a new game.
    startNewGame() {
        this.currentPlayer = 1;
        this.currentRound = 1;
        this.totalScore = 0;
        this.gameOver = false;

        this.dice.reset();
        this.engine.resetScoreTable();
    }

    // End the current turn and switch players.
    endTurn() {
        // Turn-switching logic will be added later.
    }

    // End the game and determine the winner.
    endGame() {
        this.gameOver = true;

        // Winner determination will be added later.
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

export default YatzyGame;
