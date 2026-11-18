# Drift Signal — design (TSA Video Game Design 2027-28)

**Theme:** deep-space RPG, puzzle-solving instead of combat. No weapons or violence.
**Delivery:** static HTML/CSS/vanilla JS, no download, runs in any browser, hosted on GitHub Pages.
**Premise:** You wake alone from cryosleep on the survey ship *Meridian*, drifting near a dying star. The ship AI (ORI) is damaged. Something is sending a signal. Hazards are oxygen, power, pressure and radiation, never enemies.

## RPG systems (all required by the theme)
- **Stats (3):** Engineering (ENG), Science (SCI), Empathy (EMP). Start with 6 points to place (min 1 each).
- **XP and levels:** solving a puzzle or finding a clue gives XP. Level = floor(xp / 40) + 1, max 6. Each level-up gives 1 stat point.
- **Stat checks are deterministic (no dice):** a stat at or above the number unlocks something: an extra hint, a dialogue option, or a shortcut. A low stat never blocks the game, it only makes the puzzle harder.
- **Branching dialogue:** trees with stat-gated choices and flags that change later scenes and the ending.

## Levels (the judges play the first 3; whole game 12-20 minutes)
1. **Cryo Deck.** Environmental puzzle: route power through a grid to open the door (ENG: preview which nodes matter). Dialogue with ORI (EMP: calms it).
2. **Life Support.** Logic puzzle: deduce the order to open 4 valves from written clues (SCI: removes one false clue). Social puzzle: persuade ORI to unlock the lab.
3. **The Signal.** Cipher puzzle: decode the repeating pattern (SCI hint). Social puzzle: talk to the signal's source. Choice decides the ending.
4. **(Bonus)** Epilogue/credits with ending variants.

## Code layout (explainable in the interview)
- `js/state.js` stats, XP, level, flags, save/load. Pure, tested in Node.
- `js/dialogue.js` dialogue tree engine. Pure, tested in Node.
- `js/game.js` draws the HUD, rooms, hotspots, dialogue, puzzle panel; runs a level from data.
- `js/levels/levelN.js` level data (rooms, hotspots, dialogue trees).
- `js/puzzles/*.js` one puzzle each: `Puzzles.x.start(container, ctx, onDone)`.
- No libraries, no remote files, no sound files (copyright). Optional synthesized beeps only.

## Puzzle contract
`Puzzles.<id>.start(el, ctx, done)`; `ctx = { stat(name) -> number, hint(text) }`; call `done({ solved: true })`. Must be keyboard-playable and work on touch. Never trap the player: every puzzle has a Skip-with-penalty after 3 failed tries (no XP).
