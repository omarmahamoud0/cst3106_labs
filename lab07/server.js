/*
 * Yatzy Server
 * CST3106 - Lab 07
 *
 * Responsible for serving the game and generating dice rolls.
 */

const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Serve files from the public folder beside this server.js file.
app.use(express.static(path.join(__dirname, "public")));

// Generate six random dice values.
app.get("/roll-dices", (req, res) => {
    const dice = [];

    for (let i = 0; i < 6; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        dice.push(roll);
    }

    res.json(dice);
});

// Start the server.
app.listen(PORT, () => {
    console.log(`Yatzy server running at http://localhost:${PORT}`);
});