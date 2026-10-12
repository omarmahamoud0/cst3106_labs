# Yatzy Game — Design Documentation

**Course:** CST3106  
**Lab:** 05 — Game Design Documentation  
**Student:** Omar Mahamoud

## 1. Game Overview

Yatzy is a dice game where players roll five dice and select scoring combinations to achieve the highest possible total score. The game combines luck and strategy because players must decide which dice to keep and which dice to roll again.

The purpose of this project is to design a user-friendly Yatzy game interface using HTML and CSS. The mock-up includes a game board, five dice, a scorecard, and controls for interacting with the game. The design focuses on readability, simplicity, and a consistent visual appearance.

## 2. Game Rules

### Objective

The objective is to achieve the highest total score by completing the available scoring categories on the scorecard.

### How to Play

1. The player starts a turn with five dice.
2. The player can roll the dice up to three times per turn.
3. After each roll, the player can choose which dice to keep.
4. The remaining dice can be rolled again to try to obtain a better combination.
5. At the end of the turn, the player selects one available scoring category.
6. The score is recorded in that category, and the next turn begins.
7. The game ends when all scoring categories have been completed.
8. The player with the highest total score wins. In a single-player version, the objective is to achieve the highest possible score.

### Scoring Categories

| Category | Description |
|---|---|
| Ones | Add the values of all dice showing 1. |
| Twos | Add the values of all dice showing 2. |
| Threes | Add the values of all dice showing 3. |
| Fours | Add the values of all dice showing 4. |
| Fives | Add the values of all dice showing 5. |
| Sixes | Add the values of all dice showing 6. |
| Three of a Kind | At least three dice show the same value. Score the sum of all five dice. |
| Four of a Kind | At least four dice show the same value. Score the sum of all five dice. |
| Full House | Three dice show one value and two dice show another. Score 25 points. |
| Small Straight | Four consecutive values. Score 30 points. |
| Large Straight | Five consecutive values. Score 40 points. |
| Yatzy | All five dice show the same value. Score 50 points. |
| Chance | Score the sum of all five dice. |

*Note: This project uses the standard 13-category Yatzy scoring system. The exact rules can vary between versions.*

## 3. Design System

### Colour Palette

The interface uses a dark navy background with white surfaces and green accents. This creates a modern game dashboard that keeps the dice and scorecard easy to read.

| Colour | Hex Value | Purpose |
|---|---|---|
| Primary — Navy | `#172033` | Main page background |
| Secondary — Green | `#2F9E73` | Primary buttons and selected dice |
| Accent — Light Green | `#DDF5E8` | Highlights and selected states |
| Surface — White | `#FFFFFF` | Scorecard and dice backgrounds |
| Background — Light Grey | `#F4F6F8` | Secondary panels |
| Text — Dark | `#202938` | Main text and score values |
| Text — Muted | `#6B7280` | Supporting labels |
| Border — Grey | `#D9DEE7` | Card borders and dividers |
| Error — Red | `#D64545` | Invalid actions or warnings |

### Typography

| Element | Font | Style |
|---|---|---|
| Main heading | Arial, sans-serif | Bold |
| Section headings | Arial, sans-serif | Bold |
| Subheadings | Arial, sans-serif | Semi-bold |
| Body text | Arial, sans-serif | Regular |
| Scores and numbers | Arial, sans-serif | Bold |

Arial is a widely available sans-serif font that provides good readability across desktop and mobile devices. Bold headings establish a clear visual hierarchy, while bold numbers make dice values and scores easy to identify.

## 4. Dice Design

The game uses five six-sided dice. Each die is represented by a square white tile with rounded corners, dark circular pips, and a subtle shadow.

### Design Specifications

- **Size:** Approximately 64 × 64 pixels on desktop.
- **Shape:** Square with rounded corners.
- **Background:** White (`#FFFFFF`).
- **Pips:** Dark navy (`#172033`).
- **Border:** Light grey (`#D9DEE7`).
- **Shadow:** Subtle shadow to give the dice depth.
- **Selected state:** Green border and a light green background.
- **Spacing:** Consistent gaps between the five dice.

The dice use a familiar six-sided layout so players can quickly recognize each value. A visible selected state helps players identify which dice will be kept during a turn.

## 5. Game Board Mock-up

The game board is divided into three main areas:

1. **Header:** Displays the game title, a short description, and the current turn information.
2. **Dice area:** Displays the five dice, the number of rolls remaining, and the roll button.
3. **Scorecard:** Displays the scoring categories, available scores, completed categories, and the running total.

The layout uses a centered content container with consistent spacing. On wider screens, the dice area and scorecard can appear side by side. On smaller screens, the layout stacks vertically to improve usability.

## 6. User Interactions

The mock-up is designed to demonstrate the intended interactions of the game.

- **Roll Dice:** Represents rolling the available dice.
- **Select Dice:** Clicking a die represents keeping it for the next roll.
- **Choose a Category:** Selecting an available scorecard category represents recording the turn's score.
- **View Total:** The scorecard displays category scores and the overall total.
- **New Game:** A control is included to represent restarting the game.

The HTML/CSS mock-up demonstrates the visual design of these controls. Actual dice rolling, score calculations, and game-state management would require JavaScript or another programming implementation.

## 7. Layout and Accessibility

The interface uses consistent spacing, readable text, and strong contrast between the background and foreground elements.

Buttons are designed with clear labels and sufficient clickable space. Selected dice use both colour and a visible border to make their state easier to recognize. The responsive layout allows the game board to adapt to different screen sizes.

## 8. Planned Animations

The design may include the following animations during implementation:

- A short rotation or bounce effect when dice are rolled.
- A smooth colour transition when a die is selected.
- A subtle highlight when a score is recorded.
- A brief visual confirmation when a new turn begins.

Animations should remain short and subtle so that they do not distract from gameplay.

## 9. Design Rationale

The navy, white, and green colour palette gives the game a clean and consistent appearance. Green is used for important actions and selected states so that interactive elements stand out from the rest of the interface.

Rounded dice and scorecard panels create a friendly appearance, while clear typography and a structured layout make the scoring information easy to follow. Keeping the interface simple allows players to focus on the dice, available scoring categories, and their current score.

## 10. Development Scope

This lab focuses on design documentation and a static HTML/CSS mock-up. The initial version will establish the game's layout, design system, dice appearance, scorecard, and interactive control styling.

Future implementation work may add JavaScript functionality for dice rolls, dice selection, scoring calculations, turn management, and game completion.

## 11. References

- [Markdown Guide — Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [MDN Web Docs — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)