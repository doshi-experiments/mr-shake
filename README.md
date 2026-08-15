# Mr. Shake

A pass-and-play social deduction game for one phone and three to twenty
people. Everyone gets the same word — except the ones who don't.

Live at **mr-shake.rishabhdoshi.com**. Sheet E-04.1 in the
[experiments wing](https://experiments.rishabhdoshi.com).

No backend, no accounts, no analytics. Installs as an app and works with no
signal once installed, which is where party games usually get played.

## How it plays

Pass the phone round. Each player takes their word in private, then everyone
describes their word out loud, one at a time, without saying it. Talk, argue,
vote somebody out. Repeat until one side wins.

| Role | Gets | Wants |
| --- | --- | --- |
| **Civilian** | the word | find everyone who doesn't have it |
| **Undercover** | a word that is close, but not the same | survive to the end |
| **Mr. Shake** | nothing at all | bluff, work the word out, and name it if caught |

Civilians win once every impostor is out. Impostors win once they are no
longer outnumbered. Mr. Shake, when voted out, gets one guess at the civilian
word — right, and they take the game outright, even from a board the civilians
had already won.

Two extra rules that are not obvious but make the difference between this
being a game and being a formality:

- **A civilian always speaks first.** Mr. Shake opening with zero information
  is caught on the first clue and the round is dead.
- **Which side of a pair is the civilian word is random.** Otherwise a group
  learns that Tea is always the impostor and the pack burns out.

## The words

266 pairs in `src/words.js`, split across two packs the setup screen switches
between. A pair only works inside a narrow band. Too far apart and the first
clue exposes the impostor — nobody describes *Apple* and *Car* the same way.
Too close and there is no signal at all: *Sofa* and *Couch* produce identical
clues and the round is a coin flip.

What works is same category, most attributes shared, one or two salient
differences: `Coffee / Tea`, `Butterfly / Moth`, `Hotel / Motel`,
`Alligator / Crocodile`, `Museum / Art gallery`. Both sides also have to be
describable without saying them, which rules out most abstract nouns.

**Clean** — 176 pairs across ten categories, in `PAIRS`. Food, animals, places,
films, travel, everyday life. Fine for any table.

**Rude** — 90 pairs across five categories, in `DIRTY_PAIRS`: Dating, Big night
out, Body, Bad habits, Grown-up life. Cheeky rather than explicit, and that is a
design decision before it is a taste one. The mechanic needs a word you can
gesture at sideways for one clue; graphic anatomy collapses a round into
laughing instead of deducing, and the two halves of an explicit pair usually
read as the same thing, which kills the signal the whole game runs on.
`Hangover / Still drunk` and `Ghosting / Breadcrumbing` give clues somewhere to
go in a way that a pair of body parts does not.

The packs are a swap, not a mix. A game draws from exactly one of them, chosen
before the deal and carried through *play again*, and `packFor(spicy)` is the
single place that decides which. Rude category ids are prefixed `d-` so they
cannot collide with clean ones, and switching packs clears the category
selection outright — a stale filter that silently matched nothing would look
like the game had run out of words.

Adding pairs means adding rows to `PAIRS` or `DIRTY_PAIRS`. Module-level
assertions run per pack and throw if a word appears in two pairs within its own
pack, if a pair is tagged with a category that has no chip on the setup screen,
or if a category has no pairs at all — each is invisible on screen and only
bites occasionally. Duplication *across* packs is allowed, since a word that
belongs in both can never be drawn twice in one game.

## Shared-screen secrecy

One device, N players, and player 4 must never see player 3's word. The reveal
runs in three stages rather than two:

```
"Pass the phone to Ava"   ← no word on screen; button reads "I'm Ava"
        ↓
"Tap to see your word"    ← card face down
        ↓
   the word, large        ← Mr. Shake instead sees "You're Mr. Shake"
        ↓
"Hide and pass on"        ← bottom of the screen, far from the reveal target
        ↓
"Pass the phone to Ben"
```

Three independent guards stop a fast double-tap skipping somebody, because any
one of them alone is defeatable:

1. **Different hit areas.** The reveal target is a card in the middle of the
   screen; the hide button is at the bottom. The only same-position adjacency
   left is pass → reveal, and the worst it can do is land you on a face-down
   card.
2. **A 450 ms lockout** after every transition, during which the control is
   genuinely `disabled` rather than merely ignoring the event.
3. **The index advances on the pass step, not the hide.** A tap that slips
   through on hide can only ever put you back on the same player's hand-over
   screen. It can never skip anybody.

The reducer also treats every out-of-order action as a no-op, so a stray event
from any source is inert.

A game in progress is snapshotted to `sessionStorage` on every state change, so
a phone locking or an accidental reload resumes on the same player with the
card face down rather than ending the evening. A Screen Wake Lock keeps the
screen up during discussion, where supported.

## Layout

```
src/game.js      the rules. Pure — no React, no DOM, no Math.random
src/words.js     both word packs, clean and rude
src/App.jsx      screens and components
src/app.css      tokens, theme, layout
src/main.jsx     entry point, registers the service worker
test/run.mjs     rules tests
test/e2e.mjs     browser tests, driven over CDP at a phone viewport
```

`src/game.js` takes an explicit `rng` everywhere chance is involved, which is
what lets a whole game be replayed deterministically from a seed. It imports
straight into Node with no build step.

## Tests

```bash
npm test                     # rules — 100 assertions

./build.sh
node test/serve.mjs &        # serves dist/ on 8123
node test/e2e.mjs            # browser — 65 assertions, 390×844
```

The rules suite runs 800 seeded playthroughs across both vote modes and
asserts, at every step of every game, that nobody is left standing when they
should not be, that play never continues past a satisfied win condition, and
that a civilian opens every round. It also asserts that a civilian's reveal
payload and an undercover's are **the same shape** — if either is ever told
which they are, the game is destroyed while still looking perfectly reasonable
on screen.

Both packs are checked the same way, and the swap is tested rather than assumed:
400 draws from each are asserted to come entirely from the pack that was
selected, switching packs is asserted to clear the category selection, and a
spicy game is played through far enough to confirm every civilian is holding a
word from `DIRTY_PAIRS`.

The browser suite fires two clicks 60 ms apart at each step of the reveal and
checks the player index moved by exactly one, reloads mid-reveal to confirm
nothing is exposed, and plays complete games both ways round. It also flips the
pack on the setup screen, confirms the category chips swap with it, and reads
the dealt pair back out of the running game to prove it came from the rude
pack.

## Build and deploy

```bash
npm install
npm run build      # regenerates dist/ from scratch
npm run serve      # preview at http://localhost:8099
```

Connected to Cloudflare and deployed on push to `main`. Deployed as a **Worker
serving static assets**; `wrangler.jsonc` declares `dist/` as the asset
directory. If wiring it up through Pages instead: framework preset None, build
command `npm run build`, output directory `dist`.

`dist/` is generated on every build and is not in the repo. Neither are any
binaries — fonts are copied out of the `@ibm/plex-*` packages at build time and
the PNG icons are decoded from `src/static/icons.b64.json`, so every file here
is readable text.

## Notes

- Shares the `sheet-theme` cookie with the portfolio and the experiments index,
  scoped to the registrable domain, so a light/dark choice made on any of the
  three carries to the others.
- Mobile-first to the point that desktop is the edge case. Every tap target is
  at least 44px, and the browser suite fails the build if one is not.
- The game is a prototype of the published party game *Undercover*, rethemed.
