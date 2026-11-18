# Handoff: Drift Signal: The Long Quiet (TSA Video Game Design 2027-28)

Updated 2026-11-18. Continue from any machine.

## State
- Live: https://school-user.github.io/tsa-saga/ (repo School-User/tsa-saga, branch master, GitHub Pages).
- 9 levels, 3 chapters (Meridian, Harbor Nine, Verdant). Stats ENG/SCI/EMP, XP, ranks, journal, 3 chapter endings + finale.
- Older single games are still live and unchanged: /tsa-game/, /tsa-game-2/, /tsa-game-3/ (sibling folders, same GitHub user).
- Pending: a /brag launch video made by Codex (output in brag-output/, ignored by git). Not played on the laptop (no-audio rule).

## Not done (needs Siddh)
- Demo video (5 min max: tutorial, one level played, show code/scripts/engine), portfolio PDF (title page, 2-page description, hand-drawn storyboard, Student Copyright Checklist, permission letters if any, Resources and AI Reflection max 4 pages), Student/Team ID, advisor signatures.
- Disclose: all art is AI-generated (Codex image generation, decorative); code by Claude Code, Codex, and (earlier puzzles) Freebuff/DeepSeek. See docs/ai-log.md.
- Test on a real phone, Firefox and Edge.

## Rules
- Commit and push as Siddh only: no AI co-author/session trailers. Identity: Siddh <schooluse548@gmail.com>.
- Codex (gpt-6.2-sol) is fine to use freely. Do NOT use Freebuff (ban risk).
- Never play audio on the laptop. No combat/weapons/violence in the game. No downloads/exe: static site only.
- Do not paste secrets into chat. None are stored in this repo.

## Tools
- Tests: `node tests/core.test.js` (needs Node). Syntax: `node --check js/*.js js/chapters/*.js js/puzzles/*.js`.
- Full playthrough: serve the folder (`python3 -m http.server 8770`) then `node tools/e2e-saga.mjs 8770` (needs chromium on PATH; uses tools/cdp-helper.mjs patterns; script header imports are inlined).
- Publish: `git push` (GitHub CLI login needed on the new machine: `gh auth login`, account School-User).
