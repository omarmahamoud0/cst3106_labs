# Yatzy Dice Game — Lab 07

**Course:** CST3106 – Internet Architecture and Web Development  
**Student:** Omar Mahamoud  
**Lab:** 07 – Migrating the Dice Module to Client-Server Architecture

## Project Description

This project demonstrates a client-server architecture using Node.js and Express.js.

The browser displays the Yatzy dice game interface. When the player clicks the Roll Dice button, the client requests six random dice values from the Express server. The server generates the values and sends them back as a JSON response.

The client receives the response, validates the values, and updates the dice displayed on the game interface.

## Technologies Used

- HTML5
- CSS3
- JavaScript ES Modules
- Node.js
- Express.js
- Fetch API

## Project Structure

```text
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
```

## How to Run the Project

1. Open the project folder in Visual Studio Code.
2. Open the integrated terminal.
3. Make sure the terminal is inside the `lab07` folder.
4. Install the dependencies if necessary:

```bash
npm install
```

5. Start the server:

```bash
npm start
```

6. Open the game in a browser:

http://localhost:3000

## How Dice Rolling Works

1. The player clicks the Roll Dice button.
2. The YatzyGame module calls the Dice module.
3. The Dice module sends a fetch request to `/roll-dices`.
4. The Express server generates six random values between 1 and 6.
5. The server returns the values as JSON.
6. The Dice module validates and stores the received values.
7. The YatzyGame module updates the dice displayed in the browser.

## Server Endpoint

**GET /roll-dices**

The endpoint returns an array containing six random dice values.

Example response:

```json
[3, 5, 1, 6, 2, 4]
```

## Error Handling

The Dice module checks whether the server response is successful and validates that the response contains exactly six integer values between 1 and 6.

The game also displays an error message if the dice request fails.

## Testing

- Opened `http://localhost:3000/roll-dices` directly and confirmed six values between 1 and 6 that change on every refresh.
- Clicked Roll Dice repeatedly and confirmed the dice update each time.
- Clicked New Game and confirmed all six dice reset to 1.
- Stopped the server and clicked Roll Dice to confirm the error message appears.
- Checked the browser console and confirmed the game initializes without errors.

## Project Objective

The objective of this lab is to demonstrate how the dice rolling functionality can be moved from the client side to a server using Node.js and Express.js. This separates the dice generation logic from the browser interface.
