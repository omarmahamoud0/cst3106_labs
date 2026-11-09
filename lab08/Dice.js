/**
 * Dice: holds the dice values and which dice are kept (held).
 * A value of 0 means "not rolled yet".
 */
class Dice {
  constructor(count = 5) {
    this.count = count;
    this.values = new Array(count).fill(0);
    this.held = new Array(count).fill(false);
  }

  /** Roll every die that is not held (random 1-6). */
  roll() {
    for (let i = 0; i < this.count; i++) {
      if (!this.held[i]) {
        this.values[i] = Math.floor(Math.random() * 6) + 1;
      }
    }
  }

  /** Keep or release one die. */
  toggleHold(index) {
    this.held[index] = !this.held[index];
  }

  /** Clear dice for a new turn. */
  reset() {
    this.values.fill(0);
    this.held.fill(false);
  }

  hasBeenRolled() {
    return this.values.every((v) => v >= 1);
  }
}

if (typeof module !== "undefined") {
  module.exports = { Dice };
}