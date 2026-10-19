# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Mr. Shake at mr-shake.rishabhdoshi.com: a React pass-and-play party game for one phone (a rethemed *Undercover*). Installable and offline. `README.md` is authoritative for the rules, the word packs and the secrecy design. Author commits as `doshi-experiments <311927837+doshi-experiments@users.noreply.github.com>`.

## Commands

```sh
npm ci
npm test               # rules suite, test/run.mjs (seeded playthroughs, secrecy shape checks)
npm run build          # ./build.sh → dist/ (not committed)
npm run serve          # http://localhost:8099
```

`test/e2e.mjs` (CDP at 390×844) is out of date: it looks for the old `.stepper__value` counter and stops early. Until it is fixed, rely on the design-system repository's `scripts/check-game-privacy.mjs` and `check-rollout.mjs`, which cover conceal, reload, Home/Back, appearance and 60px targets. CI builds, runs the rules suite and re-verifies `src/design-system/release.json`.

## Architecture

- `src/game.js` is the rules: pure, no React, no DOM and no `Math.random`. Chance always comes from an explicit `rng`, so a game replays from a seed and imports straight into Node.
- `src/words.js` holds the three packs and the rules they must obey. `src/App.jsx` holds the screens. `src/app.css` holds layout, role colours and the Felt touches over the shared tokens.
- The game depends on the committed design-system tarball and commits a hashed snapshot in `src/design-system/`. Never edit either; upgrade through the design-system repository's central `npm run rollout`.

## Invariants that are easy to break

- **Secrecy is the core invariant.** Civilian and undercover reveal payloads must have the same shape, and an elimination names the role, never the word.
- Tap targets are at least 44px everywhere and 60px at game density.
- Role fills (undercover mustard, Mr. Shake amber) take their text from `--on-role` (white in light mode, ink in dark mode), never from the signal's white `action-text`.
- `src/sw.template.js` precaches a fixed list; every entry must exist in `dist/`, or `cache.addAll` fails and the new worker never installs. `build.sh` must copy the design-system fonts and `felt/` tiles.
- The headline is exactly "Everyone gets the same word." with "Kind of" on the next line. Optional rules live under "How to play".
