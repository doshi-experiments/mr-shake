# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Mr. Shake at mr-shake.rishabhdoshi.com: a React pass-and-play party game for one phone (a rethemed *Undercover*). Installable and offline. `README.md` is authoritative for the rules, the word packs and the secrecy design. Author commits as `doshi-experiments <311927837+doshi-experiments@users.noreply.github.com>`.

## Never publish PII or sensitive information

Nothing personal or sensitive goes to GitHub, under any circumstances, without Rishabh's direct approval of that specific content. That covers files, commit messages, branch names, pull requests, issues, comments, release notes, screenshots and test fixtures, and it applies even while a repository is private: every repository on this account is public or will be.

- Personal data: names other than Rishabh's public name (household members, pets, friends), email addresses, phone numbers, home addresses, the city or neighbourhood the household lives in, dates of birth, health or care providers.
- Financial data: account or card numbers, balances, real transactions, statements, payees and merchant strings, amounts and dates from real data, which banks or cards are held, anything from bank exports or Actual Budget.
- Secrets and infrastructure: `.env` contents, API keys, tokens, passwords, private hostnames and IP addresses, Tailscale names, Home Assistant entity names and user ids, chat ids.
- Anything copied from a real export, inbox, database or log. A file named "example" or "sample" must be invented, not trimmed from real data.

Commit identity: author and commit only as `doshi-experiments <311927837+doshi-experiments@users.noreply.github.com>`. Run `git config user.email` before the first commit in any checkout, and never put a personal address in a `Co-authored-by` trailer.

Commit messages and pull request text are as public as the code. Describe what changed and why, not the real data that prompted it: no real merchants, amounts, transaction dates, account names or people, even as examples.

Use synthetic fixtures instead. Before every commit and push, check the staged diff, any new untracked files and the message itself for this kind of content. If something looks sensitive, or you are unsure, stop and ask; do not commit it, push it or open a pull request with it. Earlier approval of a different change does not cover this one. Git history is permanent: a leak can only be removed by rewriting history and recreating the repository.

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
