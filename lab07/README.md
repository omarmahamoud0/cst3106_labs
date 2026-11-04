# Yatzy Dice Game — Lab 07

Course: CST3106 – Internet Architecture and Web Development  
Student: Omar Mahamoud  
Lab: 07 – Migrating the Dice Module to Client-Server Architecture

## Project Description

This project demonstrates client-server architecture using Node.js and Express.js.

The browser displays the Yatzy dice game interface. When the player clicks the Roll Dice button, the client requests five random dice values from the Express server. The server generates the values and sends them back as a JSON response.

The client receives the response, validates the values, and updates the dice displayed on the game interface.

Players can hold dice between rolls, use three rolls per turn, and select scoring categories on the scorecard.

## Technologies Used

- HTML5
- CSS3
- JavaScript ES Modules
- Node.js
- Express.js
- Fetch API
- JSON

## Project Structure

lab07/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── Dice.js
│   ├── YatzyGame.js
│   └── YatzyEngine.js
├── server.js
├── package.json
├── package-lock.json
└── README.md

## How to Run the Project

1. Open the project folder in Visual Studio Code.
2. Open the integrated terminal.
3. Make sure the terminal is inside the lab07 folder.
4. Install dependencies if necessary:

   npm install

5. Start the server:

   npm start

6. Open the game in a browser:

   http://localhost:3000

## How Dice Rolling Works

1. The player clicks the Roll Dice button.
2. The YatzyGame module calls the Dice module.
3. The Dice module sends a fetch request to /roll-dices.
4. The Express server generates five random values between 1 and 6.
5. The server returns the values as JSON.
6. The Dice module validates the response and keeps selected dice unchanged.
7. The YatzyGame module updates the dice displayed in the browser.

## Server Endpoint

GET /roll-dices

The endpoint returns an array containing five random dice values.

Example response:

[3, 5, 1, 6, 2]

## Game Features

- Five dice.
- Three rolls per turn.
- Ability to hold and release dice.
- Fifteen scoring categories.
- Automatic score calculation.
- Score tracking.
- New Game functionality.
- Game ends after fifteen scoring turns.

## Error Handling

The Dice module checks whether the server response is successful and validates that the response contains exactly five integer values between 1 and 6.

The game also displays an error message if the dice request fails.

## Testing

- Opened the game and confirmed that five dice appear.
- Clicked Roll Dice and confirmed the dice update.
- Held selected dice and confirmed they remain unchanged during subsequent rolls.
- Confirmed the roll counter decreases.
- Selected scoring categories and confirmed scores are recorded.
- Clicked New Game and confirmed the dice and scorecard reset.
- Opened /roll-dices directly and confirmed the server returns five values.
- Checked the browser console for errors.

## Project Objective

The objective of this lab is to demonstrate how dice rolling functionality can be moved from the client side to a server using Node.js and Express.js. This separates the dice generation logic from the browser interface.