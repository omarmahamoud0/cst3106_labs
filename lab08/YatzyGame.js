/**
 * YatzyGame: game state, turn flow and the page (DOM).
 * Turn: roll up to 3 times, keep dice between rolls,
 * pick a category, then press "End turn".
 */
class YatzyGame {
  static MAX_ROLLS = 3;
  static TOTAL_TURNS = 15;
  static WIN_SCORE = 200; // score needed for the congratulating message

  // Which of the 9 pip spots (3x3 grid) are used for each die value
  static PIPS = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  // Lab 8: how long the roll animation lasts and how fast the faces flicker (ms)
  static ROLL_TIME = 1000;
  static FLICKER_TIME = 90;

  constructor() {
    this.isRolling = false; // Lab 8: true while the animation is running
    this.dice = new Dice(5);
    this.engine = new YatzyEngine();
    this.rollsLeft = YatzyGame.MAX_ROLLS;
    this.turn = 1;
    this.selectedCategory = null;
    this.gameOver = false;

    this.cacheElements();
    this.buildScorecard();
    this.bindEvents();
    this.startNewGame();
  }

  /** Find the page elements once. */
  cacheElements() {
    this.diceContainer = document.getElementById("dice-container");
    this.rollButton = document.getElementById("roll-button");
    this.endTurnButton = document.getElementById("end-turn-button");
    this.endGameButton = document.getElementById("end-game-button");
    this.newGameButton = document.getElementById("new-game-button");
    this.turnDisplay = document.getElementById("turn-display");
    this.rollsDisplay = document.getElementById("rolls-display");
    this.totalDisplay = document.getElementById("total-display");
    this.messageEl = document.getElementById("message");
    this.scorecardBody = document.getElementById("scorecard-body");
    this.finalBox = document.getElementById("final-box");
    this.finalScore = document.getElementById("final-score");
    this.finalMessage = document.getElementById("final-message");
  }

  /** Create the 5 dice buttons and the scorecard rows. */
  buildScorecard() {
    this.diceContainer.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const die = document.createElement("button");
      die.className = "die";
      die.dataset.index = i;
      this.diceContainer.appendChild(die);
    }

    this.scorecardBody.innerHTML = "";
    YatzyEngine.CATEGORIES.forEach((cat) => {
      this.scorecardBody.appendChild(this.makeRow(cat));
      if (cat.id === "sixes") {
        this.scorecardBody.appendChild(this.makeInfoRow("upper-sub", "Upper subtotal", "63+ gives a 50 bonus"));
        this.scorecardBody.appendChild(this.makeInfoRow("upper-bonus", "Bonus", "50 if upper subtotal is 63+"));
      }
    });
  }

  makeRow(cat) {
    const row = document.createElement("tr");
    row.className = "cat-row";
    row.dataset.id = cat.id;
    row.tabIndex = 0;
    row.innerHTML = `<td>${cat.name}</td><td class="rule">${cat.rule}</td><td class="score">—</td>`;
    return row;
  }

  makeInfoRow(id, label, note) {
    const row = document.createElement("tr");
    row.className = "info-row";
    row.id = id;
    row.innerHTML = `<td>${label}</td><td class="rule">${note}</td><td class="score">0</td>`;
    return row;
  }

  bindEvents() {
    this.rollButton.addEventListener("click", () => this.rollDice());
    this.endTurnButton.addEventListener("click", () => this.endTurn());
    this.endGameButton.addEventListener("click", () => this.endGameEarly());
    this.newGameButton.addEventListener("click", () => this.startNewGame());

    // Click a die to keep / release it
    this.diceContainer.addEventListener("click", (e) => {
      const die = e.target.closest(".die");
      if (die) this.toggleHold(Number(die.dataset.index));
    });

    // Click a category row to select it
    const pick = (e) => {
      const row = e.target.closest(".cat-row");
      if (row) this.selectCategory(row.dataset.id);
    };
    this.scorecardBody.addEventListener("click", pick);
    this.scorecardBody.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(e);
      }
    });
  }

  /** Reset everything for a fresh game. */
  startNewGame() {
    this.engine.reset();
    this.dice.reset();
    this.rollsLeft = YatzyGame.MAX_ROLLS;
    this.turn = 1;
    this.selectedCategory = null;
    this.gameOver = false;
    this.finalBox.classList.add("hidden");
    this.setMessage("Welcome! Press “Roll dice” to start your first turn.");
    this.render();
  }

  /**
   * Lab 8: draw one face (1-6) on a die with jQuery.
   * Same drawing as render(): 9 spans, a .pip class on the used spots.
   */
  drawFace($die, value) {
    $die.empty();
    for (let spot = 0; spot < 9; spot++) {
      const $cell = $("<span></span>");
      if (YatzyGame.PIPS[value].includes(spot)) $cell.addClass("pip");
      $die.append($cell);
    }
  }

  /**
   * Lab 8: roll with an animation. Dice that are not kept shake and flicker
   * through random faces. When the time is up, the real roll happens
   * (this.dice.roll()) and the page is redrawn with the final values.
   */
  rollDice() {
    if (this.gameOver || this.rollsLeft === 0 || this.isRolling) return;
    this.isRolling = true;

    // Only the dice that are NOT kept take part in the animation
    const $rollingDice = $(this.diceContainer)
      .find(".die")
      .filter((i) => !this.dice.held[i]);

    $(".buttons .btn").prop("disabled", true);             // no clicks while rolling
    $rollingDice.removeClass("empty").addClass("rolling"); // start the shake
    this.setMessage("Rolling...");

    // Every few ms show a random face on each rolling die
    const flicker = setInterval(() => {
      $rollingDice.each((i, el) => this.drawFace($(el), Math.floor(Math.random() * 6) + 1));
    }, YatzyGame.FLICKER_TIME);

    // After ROLL_TIME: stop the animation and do the real roll
    setTimeout(() => {
      clearInterval(flicker);
      $rollingDice.removeClass("rolling");

      this.dice.roll();                                    // final random values (Dice.js)
      this.rollsLeft--;
      this.selectedCategory = null;
      this.isRolling = false;

      if (this.rollsLeft === 0) {
        this.setMessage("No rolls left. Pick a category, then press “End turn”.");
      } else {
        this.setMessage(`Keep the dice you want, then roll again (${this.rollsLeft} left) — or pick a category.`);
      }
      this.render();                                       // final dice + button states
      $("#new-game-button").prop("disabled", false);       // render() does not touch this one
    }, YatzyGame.ROLL_TIME);
  }

  toggleHold(index) {
    // Can only keep dice after rolling, and only if a roll is left
    if (this.isRolling || this.gameOver || !this.dice.hasBeenRolled() || this.rollsLeft === 0) return;
    this.dice.toggleHold(index);
    this.render();
  }

  selectCategory(categoryId) {
    if (this.isRolling) return;
    if (this.gameOver || !this.dice.hasBeenRolled()) {
      this.setMessage("Roll the dice first.");
      return;
    }
    if (this.engine.scores[categoryId] !== null) {
      this.setMessage("That category is already used. Pick another one.");
      return;
    }
    this.selectedCategory = categoryId;
    const name = YatzyEngine.CATEGORIES.find((c) => c.id === categoryId).name;
    const points = this.engine.calculateScore(categoryId, this.dice.values);
    this.setMessage(`${name} selected for ${points} point${points === 1 ? "" : "s"}. Press “End turn” to confirm.`);
    this.render();
  }

  /** Lock in the selected category and move to the next turn. */
  endTurn() {
    if (this.gameOver || !this.selectedCategory) return;
    const points = this.engine.recordScore(this.selectedCategory, this.dice.values);
    if (points === null) return;

    const name = YatzyEngine.CATEGORIES.find((c) => c.id === this.selectedCategory).name;
    this.selectedCategory = null;

    if (this.engine.isComplete()) {
      this.finishGame();
      return;
    }
    this.turn++;
    this.dice.reset();
    this.rollsLeft = YatzyGame.MAX_ROLLS;
    this.setMessage(`Scored ${points} in ${name}. Turn ${this.turn}: roll the dice!`);
    this.render();
  }

  endGameEarly() {
    if (this.gameOver) return;
    if (window.confirm("End the game now? Empty categories will score 0.")) {
      this.finishGame();
    }
  }

  finishGame() {
    this.gameOver = true;
    this.selectedCategory = null;
    const total = this.engine.totalScore();
    this.finalScore.textContent = total;
    this.finalMessage.textContent =
      total >= YatzyGame.WIN_SCORE
        ? "Congratulations! Great game — that is a strong score!"
        : "Good effort! Your score was under 200 — try again to beat it.";
    this.finalBox.classList.remove("hidden");
    this.setMessage("Game over. Press “New game” to play again.");
    this.render();
    this.finalBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  setMessage(text) {
    this.messageEl.textContent = text;
  }

  /** Redraw the whole page from the current state. */
  render() {
    const rolled = this.dice.hasBeenRolled();

    // Status
    this.turnDisplay.textContent = `${Math.min(this.turn, YatzyGame.TOTAL_TURNS)} / ${YatzyGame.TOTAL_TURNS}`;
    this.rollsDisplay.textContent = this.rollsLeft;
    this.totalDisplay.textContent = this.engine.totalScore();

    // Dice
    this.diceContainer.querySelectorAll(".die").forEach((die, i) => {
      const value = this.dice.values[i];
      die.innerHTML = "";
      die.classList.toggle("selected", this.dice.held[i]);
      die.classList.toggle("empty", value === 0);
      die.disabled = this.gameOver || !rolled || this.rollsLeft === 0;
      die.setAttribute("aria-label", value ? `Die ${i + 1}: ${value}${this.dice.held[i] ? ", kept" : ""}` : `Die ${i + 1}: not rolled`);
      if (value) {
        for (let spot = 0; spot < 9; spot++) {
          const cell = document.createElement("span");
          if (YatzyGame.PIPS[value].includes(spot)) cell.className = "pip";
          die.appendChild(cell);
        }
      }
    });

    // Scorecard rows
    this.scorecardBody.querySelectorAll(".cat-row").forEach((row) => {
      const id = row.dataset.id;
      const saved = this.engine.scores[id];
      const scoreCell = row.querySelector(".score");
      row.classList.toggle("used", saved !== null);
      row.classList.toggle("selected", id === this.selectedCategory);
      row.classList.toggle("disabled", this.gameOver || (saved === null && !rolled));
      row.classList.remove("preview");
      if (saved !== null) {
        scoreCell.textContent = saved;
      } else if (rolled && !this.gameOver) {
        scoreCell.textContent = this.engine.calculateScore(id, this.dice.values);
        row.classList.add("preview");
      } else {
        scoreCell.textContent = "—";
      }
    });

    document.querySelector("#upper-sub .score").textContent = this.engine.upperSubtotal();
    document.querySelector("#upper-bonus .score").textContent = this.engine.bonus();

    // Buttons
    this.rollButton.disabled = this.gameOver || this.rollsLeft === 0;
    this.rollButton.textContent = rolled ? "Roll again" : "Roll dice";
    this.endTurnButton.disabled = this.gameOver || !this.selectedCategory;
    this.endGameButton.disabled = this.gameOver;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.yatzyGame = new YatzyGame();
  });
}