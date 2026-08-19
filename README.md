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
- **Nobody is Mr. Shake twice running.** It is the memorable role and the table
  is usually the same six people all evening, so a fair shuffle that hands it
  back to the same person reads as broken even though it isn't. Seats that held
  it last deal are moved off it afterwards, which keeps the shuffle uniform and
  the deal replayable from a seed. If there is nowhere legal to move it, the
  deal still happens — a game that deals beats a constraint that always holds.
- **An elimination reveals the role but not the word.** See below.

## The words

281 pairs in `src/words.js`, split across three packs the setup screen switches
between. A pair only works inside a narrow band. Too far apart and the first
clue exposes the impostor — nobody describes *Apple* and *Car* the same way.
Too close and there is no signal at all: *Sofa* and *Couch* produce identical
clues and the round is a coin flip.

What works is same category, most attributes shared, one or two salient
differences: `Coffee / Tea`, `Butterfly / Moth`, `Hotel / Motel`,
`Crocodile / Hippo`, `Whip / Paddle`. Both sides also have to be describable
without saying them, which rules out most abstract nouns.

**Every word is a single word.** No spaces, no hyphens, enforced by an
assertion rather than by discipline. Two reasons, and the second is the one
that actually bites: a phrase is hard to describe without saying half of it —
*Netflix and chill* leaks *Netflix* on the first clue — and Mr. Shake has to
type the civilian word back at the end, where a phrase turns the guess into a
spelling test. Dropping the rule cost about 20% of the clean pack and most of
the rude one, and both read better for it.

| Pack | Pairs | Categories | |
| --- | --- | --- | --- |
| Clean | 176 | 10 | Food, animals, places, films, travel. Fine for any table. |
| Rude | 65 | 5 | Dating, nights out, bodies, bad habits. Innuendo, not anatomy. |
| Explicit | 40 | 5 | Sex, anatomy, kinks, kit. No euphemism. |

The line between the second and third is a design decision before it is a taste
one. Innuendo gives a clue somewhere to go — you can gesture sideways at
*Hangover* for a whole turn. Explicit has to work harder to stay playable, for
two reasons stacked on top of each other. First, the usual one: two words for
the same act produce identical clues and the round becomes a coin flip, so
pairs are built as neighbours rather than synonyms — `Bondage / Chastity`, not
a pair of words that mean the same thing.

Second, and specific to this pack: **both words have to be equally
unsayable.** A pair like `Nipple / Earlobe` looks fine on the neighbour test —
same region, plausible clue overlap — but the civilian holding *Earlobe* has
nothing to lose by describing it honestly in front of the table. The entire
point of the pack is that surviving a round costs something, and a clean word
on either side removes that cost for whoever holds it. This is why Explicit
went from 60 pairs to 40 rather than growing: about a third of the original
set turned out to be one filthy word bolted to one anyone could say out loud
at work, and cutting them was the point, not a shame.

The packs are a swap, not a mix. A game draws from exactly one of them, chosen
before the deal and carried through *play again*, and `packFor(pack)` is the
single place that decides which. Category ids are prefixed per pack — `d-` for
rude, `x-` for explicit — so a selection cannot collide across packs, and
switching packs clears the category selection outright: a stale filter that
silently matched nothing would look like the game had run out of words.

Adding pairs means adding rows to `PAIRS`, `DIRTY_PAIRS` or `EXPLICIT_PAIRS`.
Module-level assertions run per pack and throw if a word is not a single word,
if a word appears in two pairs within its own pack, if a pair is tagged with a
category that has no chip on the setup screen, or if a category has no pairs at
all — each is invisible on screen and only bites occasionally. Duplication
*across* packs is allowed, since a word that belongs in more than one can never
be drawn twice in the same game.

The setting used to be a boolean called `spicy`, so `normalizePack()` still
accepts `true`/`false` and maps them onto pack ids. A phone that installed the
two-pack version keeps its choice instead of silently reverting to clean.

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

The same three stages are reused for the eye beside each name on the describe
list, which hands the phone back to somebody who has forgotten their word. The
risk there is identical — whoever is holding the phone is not necessarily the
person whose word is about to be on screen — so it gets the same hand-over
gate, the same face-down card and the same lockout rather than a shortcut. The
peek is component state, not game state, so a reload mid-peek lands back on the
describe list rather than resuming with a word on screen.

### An elimination names the role, never the word

Voting somebody out announces which side they were on — *was a civilian*, *was
an undercover*, *was Mr. Shake* — because that is the result of the vote and it
belongs to the table. What it no longer prints is the word they were holding.

The game is usually still running at that point, and *"their word was Butter"*
hands every surviving impostor the civilian word outright; off an undercover it
gives away how close the two halves are, which is nearly as bad. The person
running the game is normally playing too, so there is no one it is safe to show
it to. The screen says the word is being withheld rather than leaving a gap,
and everything comes out at game over.

The live impostor count stays. The role reveals make it arithmetic anybody at
the table can already do, so hiding it would withhold nothing and only make the
board harder to read.

## Layout

```
src/game.js      the rules. Pure — no React, no DOM, no Math.random
src/words.js     the three word packs, and the rules they must obey
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
npm test                     # rules — 120 assertions

./build.sh
node test/serve.mjs &        # serves dist/ on 8123
node test/e2e.mjs            # browser — 85 assertions, 390×844
```

The rules suite runs 800 seeded playthroughs across both vote modes and
asserts, at every step of every game, that nobody is left standing when they
should not be, that play never continues past a satisfied win condition, and
that a civilian opens every round. It also asserts that a civilian's reveal
payload and an undercover's are **the same shape** — if either is ever told
which they are, the game is destroyed while still looking perfectly reasonable
on screen.

All three packs are checked the same way, and the swap is tested rather than
assumed: 400 draws from each are asserted to come entirely from the pack that
was selected, switching packs is asserted to clear the category selection, and
a game on each pack is played far enough to confirm the dealt pair came from
it. Mr. Shake is dealt 200 consecutive times and asserted never to land on the
same seat twice running while still reaching every seat at the table.

The browser suite fires two clicks 60 ms apart at each step of the reveal and
checks the player index moved by exactly one, reloads mid-reveal to confirm
nothing is exposed, and plays complete games both ways round. It also flips
between all three packs and confirms the chips swap with them, opens a peek
from the describe list and asserts the word shown is the one that seat was
actually dealt, and — the one worth having — votes a player out and asserts
that the screen names their role while printing neither of the two words
anywhere on it.

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
