/**
 * Lab 8: dice rolling animation with jQuery.
 * The die drawing (3x3 grid of pips) and the PIPS table come from
 * my Assignment 1 Yatzy game (YatzyGame.js).
 */

// Which of the 9 pip spots (3x3 grid) are used for each die value
const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const ROLL_TIME = 1000;    // how long the animation lasts (ms)
const FLICKER_TIME = 90;   // how often the face changes while rolling (ms)

/** Random whole number from 1 to 6 (same formula as Dice.js). */
function randomValue() {
  return Math.floor(Math.random() * 6) + 1;
}

/** Draw a value (1-6) on the die: 9 spans, a .pip class on the used ones. */
function showValue($die, value) {
  $die.empty();                                    // remove the old pips
  for (let spot = 0; spot < 9; spot++) {
    const $cell = $("<span></span>");              // create a grid cell
    if (PIPS[value].includes(spot)) {
      $cell.addClass("pip");                       // this spot gets a dot
    }
    $die.append($cell);
  }
  $die.attr("aria-label", "Die showing " + value);
}

/** Roll animation: shake + flicker random faces, then show the final value. */
function rollDie($die, $button, $message) {
  $button.prop("disabled", true);                  // no clicking during the roll
  $message.text("Rolling...");
  $die.addClass("rolling");                        // starts the CSS shake

  // Change the face every few milliseconds while shaking
  const flicker = setInterval(function () {
    showValue($die, randomValue());
  }, FLICKER_TIME);

  // After ROLL_TIME stop the animation and show the real result
  setTimeout(function () {
    clearInterval(flicker);
    $die.removeClass("rolling");

    const result = randomValue();                  // final random 1-6
    showValue($die, result);

    $message.text("You rolled a " + result + "!");
    $button.prop("disabled", false);
  }, ROLL_TIME);
}

// Run when the page is ready ($(function) is jQuery's DOM-ready shortcut)
$(function () {
  const $die = $("#die");
  const $button = $("#roll-button");
  const $message = $("#message");

  showValue($die, 6);                              // the die starts with 6 dots

  // jQuery click handler on the button
  $button.on("click", function () {
    rollDie($die, $button, $message);
  });
});