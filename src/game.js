/* ------------------------------------------------------------------ *
 *  Mr. Shake — the rules
 *
 *  Pure. No React, no DOM, no storage, no Math.random. Every function
 *  that needs chance takes an `rng` argument, which is what lets the
 *  whole thing be replayed deterministically in a test.
 *
 *  THE RULE THAT IS EASIEST TO GET WRONG: civilians and undercovers are
 *  never told which they are. They are handed a word and nothing else —
 *  working out whether yours is the odd one out is the entire game. Only
 *  Mr. Shake learns their role, and only because an empty card gives it
 *  away regardless. See revealFor().
 * ------------------------------------------------------------------ */

import { packFor } from "./words.js";

export const CIVILIAN = "civilian";
export const UNDERCOVER = "undercover";
export const MRSHAKE = "mrshake";

export const ROLE_LABEL = {
  [CIVILIAN]: "Civilian",
  [UNDERCOVER]: "Undercover",
  [MRSHAKE]: "Mr. Shake",
};

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;
/* Mr. Shake starts with no information at all. In a three-player game
 * that is one clue heard before having to speak, which is not a game so
 * much as a coin flip, so the role needs a bigger table. */
export const MIN_PLAYERS_FOR_MRSHAKE = 4;

/* ---------------- randomness ---------------- */

// Small deterministic PRNG. Seeded in tests, seeded from the clock in play.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher–Yates. Returns a new array; never mutates the input.
export function shuffle(list, rng) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ---------------- setup ---------------- */

/* Role counts that make a decent game at each size. Roughly one impostor
 * per four players, with Mr. Shake appearing once there are enough people
 * for them to have heard something before speaking. */
export function defaultComposition(n) {
  const players = clamp(n, MIN_PLAYERS, MAX_PLAYERS);
  let undercovers = Math.max(1, Math.floor(players / 4));
  let mrShakes = players >= 6 ? 1 : 0;
  // Never let the defaults produce a game that is already over.
  while (undercovers + mrShakes >= players - undercovers - mrShakes) {
    if (mrShakes > 0) mrShakes -= 1;
    else undercovers -= 1;
  }
  return { players, undercovers, mrShakes, civilians: players - undercovers - mrShakes };
}

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/* Returns a list of human-readable problems. Empty means playable. */
export function validateSetup({ players, undercovers, mrShakes }) {
  const errors = [];
  const civilians = players - undercovers - mrShakes;
  const impostors = undercovers + mrShakes;

  if (players < MIN_PLAYERS) errors.push("You need at least " + MIN_PLAYERS + " players.");
  if (players > MAX_PLAYERS) errors.push("More than " + MAX_PLAYERS + " players is a crowd, not a game.");
  if (impostors < 1) errors.push("Add at least one Undercover or Mr. Shake — there is nobody to find otherwise.");
  if (civilians < 1) errors.push("Somebody has to be a civilian.");
  // Not a taste call: at impostors >= civilians the win condition is already
  // satisfied, so the game would end on the first check without a round played.
  if (impostors >= civilians)
    errors.push("Civilians have to outnumber the impostors, or the game is over before it starts.");
  if (mrShakes > 0 && players < MIN_PLAYERS_FOR_MRSHAKE)
    errors.push("Mr. Shake needs at least " + MIN_PLAYERS_FOR_MRSHAKE + " players to have a chance.");

  return errors;
}

export function defaultNames(n) {
  return Array.from({ length: n }, () => "");
}

/* ---------------- dealing ---------------- */

export function pickPair(rng, { categories = null, used = [], spicy = false } = {}) {
  const all = packFor(spicy).pairs;
  let pool = all;
  if (categories && categories.length) pool = pool.filter((p) => categories.includes(p[2]));
  if (!pool.length) pool = all;

  // Don't repeat a pair until the pack is exhausted, then start over.
  const usedSet = new Set(used);
  const fresh = pool.filter((p) => !usedSet.has(p[0] + "|" + p[1]));
  const from = fresh.length ? fresh : pool;

  const [a, b, category] = from[Math.floor(rng() * from.length)];
  // Which side the civilians get is decided here, so a pair plays
  // differently the second time a group sees it.
  const flip = rng() < 0.5;
  return {
    civilian: flip ? b : a,
    undercover: flip ? a : b,
    category,
    id: a + "|" + b,
  };
}

export function dealRoles({ names, undercovers, mrShakes }, pair, rng) {
  const n = names.length;
  const roles = [];
  for (let i = 0; i < undercovers; i++) roles.push(UNDERCOVER);
  for (let i = 0; i < mrShakes; i++) roles.push(MRSHAKE);
  while (roles.length < n) roles.push(CIVILIAN);

  const dealt = shuffle(roles, rng);
  return names.map((name, i) => ({
    id: i,
    name: name && name.trim() ? name.trim() : "Player " + (i + 1),
    role: dealt[i],
    word: dealt[i] === CIVILIAN ? pair.civilian : dealt[i] === UNDERCOVER ? pair.undercover : null,
    alive: true,
    eliminatedRound: null,
  }));
}

/* What a player is allowed to see on their own reveal card.
 *
 * Civilians and undercovers get the SAME SHAPE — a word and nothing else.
 * If this ever returns a role for either of them the game is destroyed
 * while still looking perfectly reasonable on screen, so the test suite
 * asserts the two are indistinguishable. */
export function revealFor(player) {
  if (player.role === MRSHAKE) return { kind: MRSHAKE, word: null };
  return { kind: "word", word: player.word };
}

/* ---------------- the round ---------------- */

export const living = (players) => players.filter((p) => p.alive);

export function counts(players) {
  const alive = living(players);
  const civilians = alive.filter((p) => p.role === CIVILIAN).length;
  const undercovers = alive.filter((p) => p.role === UNDERCOVER).length;
  const mrShakes = alive.filter((p) => p.role === MRSHAKE).length;
  return { civilians, undercovers, mrShakes, impostors: undercovers + mrShakes, alive: alive.length };
}

/* Speaking order, reshuffled every round, with a civilian forced into
 * first position. Mr. Shake opening with zero information is caught on
 * the first clue and the round is dead — the published game seats around
 * this, and it is the difference between the role being playable and not. */
export function speakingOrder(players, rng) {
  const alive = shuffle(living(players), rng);
  const firstCivilian = alive.findIndex((p) => p.role === CIVILIAN);
  if (firstCivilian > 0) {
    const [civ] = alive.splice(firstCivilian, 1);
    alive.unshift(civ);
  }
  return alive.map((p) => p.id);
}

/* Civilians win once every impostor is out. Impostors win once they are
 * no longer outnumbered — `>=` rather than `===`, which subsumes the
 * equality case and also covers the classic last-two finish. */
export function checkWin(players) {
  const c = counts(players);
  if (c.impostors === 0) return "civilians";
  if (c.impostors >= c.civilians) return "impostors";
  return null;
}

export function eliminate(players, id, round) {
  return players.map((p) =>
    p.id === id ? { ...p, alive: false, eliminatedRound: round } : p
  );
}

/* ---------------- voting ---------------- */

/* ballots: { voterId: targetId }. Returns every player tied at the top,
 * so the caller can decide between a runoff and letting the round pass. */
export function tallyBallots(ballots) {
  const tally = {};
  for (const target of Object.values(ballots)) {
    if (target === null || target === undefined) continue;
    tally[target] = (tally[target] || 0) + 1;
  }
  const entries = Object.entries(tally).map(([id, n]) => [Number(id), n]);
  if (!entries.length) return { tally: {}, top: [], tied: false, votes: 0 };
  const most = Math.max(...entries.map((e) => e[1]));
  const top = entries.filter((e) => e[1] === most).map((e) => e[0]);
  return { tally, top, tied: top.length > 1, votes: most };
}

/* ---------------- Mr. Shake's last guess ---------------- */

/* Forgiving on the things that are not the point — case, spacing,
 * punctuation, "the", and a naive plural — and strict on the word itself.
 * Somebody typing "coffees" on a phone keyboard has guessed correctly. */
export function normalizeGuess(s) {
  let t = String(s == null ? "" : s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(a|an|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Naive singularisation, applied to the last word only.
  t = t.replace(/(\w+?)(ies|es|s)$/, (m, stem, suffix) => {
    if (suffix === "ies") return stem + "y";           // fries → fry
    if (suffix === "es")
      // boxes → box and dishes → dish, but coffees → coffee: after a stem
      // that is not a sibilant, the "e" belongs to the word, not the plural.
      return /(s|x|z|ch|sh)$/.test(stem) ? stem : stem + "e";
    // crisps → crisp, but "bus" is not the plural of "bu": below three
    // letters the stem is not a word, and stripping there would stop
    // "buses" matching "bus".
    if (suffix === "s" && stem.length >= 3 && !/s$/.test(stem)) return stem;
    return m;
  });
  return t;
}

export function guessIsCorrect(guess, civilianWord) {
  const g = normalizeGuess(guess);
  return g.length > 0 && g === normalizeGuess(civilianWord);
}

/* ------------------------------------------------------------------ *
 *  State machine
 *
 *  setup → reveal → describe → vote → [shakeGuess] → elimination
 *            ↑                                            │
 *            └──────────── describe ←────────────────────┘
 *                                                    or → gameover
 * ------------------------------------------------------------------ */

export const PHASES = [
  "setup", "reveal", "describe", "vote", "ballot", "shakeGuess", "elimination", "gameover",
];

export function initialState() {
  return {
    phase: "setup",
    setup: {
      ...defaultComposition(6),
      names: defaultNames(6),
      voteMode: "aloud",          // "aloud" | "ballot"
      spicy: false,               // false = the clean pack
      categories: [],             // empty means every category in the pack
    },
    usedPairs: [],
    players: [],
    pair: null,
    round: 0,
    revealIndex: 0,
    revealStage: "pass",          // "pass" | "hidden" | "shown"
    order: [],
    spoken: [],
    ballots: {},
    ballotIndex: 0,
    runoff: null,                 // ids still in contention, or null
    pendingVote: null,
    lastEliminated: null,
    shakeGuess: null,
    winner: null,
    winNote: null,
  };
}

function startRound(state, players, rng) {
  return {
    ...state,
    phase: "describe",
    players,
    round: state.round + 1,
    order: speakingOrder(players, rng),
    spoken: [],
    ballots: {},
    ballotIndex: 0,
    runoff: null,
    pendingVote: null,
  };
}

/* Applies an elimination and decides what comes next. Shared by both
 * vote modes and by the Mr. Shake guess branch, so the win check can
 * only ever be written once. */
function resolveElimination(state, id, rng) {
  const players = eliminate(state.players, id, state.round);
  const victim = players.find((p) => p.id === id);
  const next = { ...state, players, lastEliminated: id };

  if (victim.role === MRSHAKE) {
    // Their one shot at the civilian word, before any win check: guessing
    // right steals the game even from a board the civilians had won.
    return { ...next, phase: "shakeGuess", shakeGuess: null };
  }
  return afterElimination(next, rng);
}

function afterElimination(state, rng) {
  const winner = checkWin(state.players);
  if (winner) {
    return {
      ...state,
      phase: "gameover",
      winner,
      winNote:
        winner === "civilians"
          ? "Every impostor is out."
          : "The impostors are no longer outnumbered.",
    };
  }
  return { ...state, phase: "elimination" };
}

export function reduce(state, action, rng = Math.random) {
  switch (action.type) {
    /* ---- setup ---- */
    case "setup/patch": {
      const setup = { ...state.setup, ...action.patch };
      // Keep names in step with the player count without losing what was typed.
      if (action.patch.players !== undefined) {
        const n = clamp(action.patch.players, MIN_PLAYERS, MAX_PLAYERS);
        const names = setup.names.slice(0, n);
        while (names.length < n) names.push("");
        setup.players = n;
        setup.names = names;
        const impostors = setup.undercovers + setup.mrShakes;
        // Shrinking the table can strand a composition that no longer fits.
        if (impostors >= n - impostors) Object.assign(setup, defaultComposition(n));
      }
      setup.civilians = setup.players - setup.undercovers - setup.mrShakes;
      return { ...state, setup };
    }
    case "setup/name": {
      const names = state.setup.names.slice();
      names[action.index] = action.name;
      return { ...state, setup: { ...state.setup, names } };
    }
    /* Switching packs MUST clear the category selection in the same step.
     * The two packs have disjoint category ids, so a selection left over
     * from the other one would leave every chip looking wrong while the
     * pool quietly fell back to everything. Hence its own action rather
     * than a setup/patch. */
    case "setup/setPack":
      return {
        ...state,
        setup: { ...state.setup, spicy: !!action.spicy, categories: [] },
      };
    case "setup/toggleCategory": {
      const cur = state.setup.categories;
      const categories = cur.includes(action.id)
        ? cur.filter((c) => c !== action.id)
        : cur.concat(action.id);
      return { ...state, setup: { ...state.setup, categories } };
    }

    /* ---- dealing ---- */
    case "game/start": {
      if (validateSetup(state.setup).length) return state;
      const pair = pickPair(rng, {
        categories: state.setup.categories,
        used: state.usedPairs,
        spicy: state.setup.spicy,
      });
      const players = dealRoles(state.setup, pair, rng);
      return {
        ...state,
        phase: "reveal",
        pair,
        usedPairs: state.usedPairs.concat(pair.id),
        players,
        round: 0,
        revealIndex: 0,
        revealStage: "pass",
        winner: null,
        winNote: null,
        lastEliminated: null,
        shakeGuess: null,
      };
    }

    /* ---- reveal, one player at a time ----
     *
     * Three stages rather than two, and the index advances on the PASS
     * step rather than the hide. A tap that slips through on hide can
     * therefore only ever land you back on the pass screen for the same
     * player — it can never skip anybody. */
    case "reveal/accept":                       // "I'm Ava" → card, face down
      return state.revealStage === "pass" ? { ...state, revealStage: "hidden" } : state;
    case "reveal/show":
      return state.revealStage === "hidden" ? { ...state, revealStage: "shown" } : state;
    case "reveal/hide": {
      if (state.revealStage !== "shown") return state;
      const nextIndex = state.revealIndex + 1;
      if (nextIndex >= state.players.length) return startRound(state, state.players, rng);
      return { ...state, revealIndex: nextIndex, revealStage: "pass" };
    }

    /* ---- describing ---- */
    case "describe/toggleSpoken": {
      const spoken = state.spoken.includes(action.id)
        ? state.spoken.filter((x) => x !== action.id)
        : state.spoken.concat(action.id);
      return { ...state, spoken };
    }
    case "describe/done":
      return {
        ...state,
        phase: state.setup.voteMode === "ballot" ? "ballot" : "vote",
        ballots: {},
        ballotIndex: 0,
        runoff: null,
        pendingVote: null,
      };

    /* ---- voting aloud ---- */
    case "vote/propose":
      return { ...state, pendingVote: action.id };
    case "vote/cancel":
      return { ...state, pendingVote: null };
    case "vote/confirm": {
      if (state.pendingVote === null) return state;
      return resolveElimination({ ...state, pendingVote: null }, state.pendingVote, rng);
    }

    /* ---- secret ballot ---- */
    case "ballot/cast": {
      // A runoff narrows the candidates, not the electorate.
      const voters = living(state.players);
      const voter = voters[state.ballotIndex];
      if (!voter) return state;
      const ballots = { ...state.ballots, [voter.id]: action.id };
      const nextIndex = state.ballotIndex + 1;
      if (nextIndex < voters.length) return { ...state, ballots, ballotIndex: nextIndex };

      const result = tallyBallots(ballots);
      if (!result.top.length) return { ...state, ballots, phase: "elimination", lastEliminated: null };
      if (result.tied) {
        // One runoff between the tied players; a second tie means nobody goes.
        if (state.runoff) {
          return afterElimination(
            { ...state, ballots, lastEliminated: null, runoff: null },
            rng
          );
        }
        return { ...state, ballots: {}, ballotIndex: 0, runoff: result.top };
      }
      return resolveElimination({ ...state, ballots, runoff: null }, result.top[0], rng);
    }

    /* ---- Mr. Shake's guess ---- */
    case "shake/guess": {
      const correct = guessIsCorrect(action.guess, state.pair.civilian);
      const next = { ...state, shakeGuess: { guess: action.guess, correct } };
      if (correct) {
        return {
          ...next,
          phase: "gameover",
          winner: "mrshake",
          winNote: "Mr. Shake named the word on the way out.",
        };
      }
      return afterElimination(next, rng);
    }

    /* Renaming whoever is holding the phone. Writes to BOTH the dealt
     * player and the setup roster: the first so it shows immediately,
     * the second so it survives into the next game. Writing only one of
     * the two is the obvious bug here. */
    case "player/rename": {
      const name = String(action.name || "").trim().slice(0, 18);
      if (!name) return state;
      const players = state.players.map((p) =>
        p.id === action.id ? { ...p, name } : p
      );
      const names = state.setup.names.slice();
      if (action.id >= 0 && action.id < names.length) names[action.id] = name;
      return { ...state, players, setup: { ...state.setup, names } };
    }

    /* ---- between rounds ---- */
    case "round/next":
      return startRound(state, state.players, rng);

    /* ---- restarting ---- */
    case "game/again": {
      // Same table, fresh roles and a pair they have not had yet.
      const pair = pickPair(rng, {
        categories: state.setup.categories,
        used: state.usedPairs,
        spicy: state.setup.spicy,
      });
      const players = dealRoles(state.setup, pair, rng);
      return {
        ...initialState(),
        setup: state.setup,
        usedPairs: state.usedPairs.concat(pair.id),
        phase: "reveal",
        pair,
        players,
      };
    }
    case "game/reset":
      return { ...initialState(), setup: state.setup, usedPairs: state.usedPairs };

    default:
      return state;
  }
}
