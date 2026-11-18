# Drift Signal: The Long Quiet

The campaign has nine rooms across Meridian, Harbor Nine, and Verdant. Each chapter uses its own flag and XP identifiers. Chapter select returns to the start of an unlocked chapter with stats, XP, flags, and journal entries intact. A puzzle bypass records a journal entry and earns zero XP. The finale uses Meridian’s title art if the optional finale image is missing.

## Files created

- `index.html` loads the static campaign in script order.
- `js/meta.js` holds the title data and nine epilogue sentences.
- `js/chapters/ch1.js`, `js/chapters/ch2.js`, and `js/chapters/ch3.js` hold the chapter cards, rooms, dialogue, and outcomes.
- `js/loader.js` builds the nine global rooms and namespaces chapter identifiers.
- `docs/saga-notes.md` records the merge.

## Files changed

- `js/game.js` adds the title menu, chapter cards, journal, and finale.
- `js/state.js` updates rank progression and stores campaign and journal progress.
- `js/dialogue.js` keeps ending choices exclusive within their chapter.
- `css/game.css` adds the chapter accents, journal layout, and reduced-motion-aware fade.
- `js/puzzles/power.js` fixes keyboard focus so the selected grid tile is the only tile in the tab order.
- `js/puzzles/scales.js` compares both pans’ total weights, including crate count and the extra weight of the heavy crate.
- `js/puzzles/lights.js` and `js/puzzles/sliding.js` use Seed Vault and Water Room wording. Their rules are the same.
- `tests/core.test.js` covers save compatibility, rank thresholds, ending flags, and the exits and dialogue paths in the merged campaign.

## Files removed

- `js/chapters-src/ch1_meta.js`, `js/chapters-src/ch1_level1.js`, `js/chapters-src/ch1_level2.js`, `js/chapters-src/ch1_level3.js`
- `js/chapters-src/ch2_meta.js`, `js/chapters-src/ch2_level1.js`, `js/chapters-src/ch2_level2.js`, `js/chapters-src/ch2_level3.js`
- `js/chapters-src/ch3_meta.js`, `js/chapters-src/ch3_level1.js`, `js/chapters-src/ch3_level2.js`, `js/chapters-src/ch3_level3.js`

## Verification

Every JavaScript file passed `node --check`. The core tests passed. A browser playthrough solved all nine puzzles, collected all 20 journal entries, verified card and finale saves, revisited chapters through chapter select, and verified that Play again cleared the save.
