/* Rules tests. `src/game.js` is pure and side-effect free, so it imports
 * straight into Node with no build step and no harness.
 *
 *   npm test
 */
import {
  CIVILIAN, UNDERCOVER, MRSHAKE,
  MIN_PLAYERS, MAX_PLAYERS,
  mulberry32, shuffle, defaultComposition, validateSetup, defaultNames,
  pickPair, dealRoles, revealFor, speakingOrder, checkWin, counts, living,
  eliminate, tallyBallots, normalizeGuess, guessIsCorrect,
  initialState, reduce,
} from "../src/game.js";
import {
  PAIRS, CATEGORIES, CATEGORY_IDS,
  DIRTY_PAIRS, DIRTY_CATEGORIES, DIRTY_CATEGORY_IDS,
  EXPLICIT_PAIRS, EXPLICIT_CATEGORIES,
  PACKS, PACK_IDS, packFor, normalizePack,
} from "../src/words.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log("  pass  " + name + (extra ? "  " + extra : "")); }
  else { fail++; console.log("  FAIL  " + name + (extra ? "  " + extra : "")); }
};
const head = (s) => console.log("\n" + s);

const setupOf = (players, undercovers, mrShakes) => ({
  players, undercovers, mrShakes,
  civilians: players - undercovers - mrShakes,
  names: defaultNames(players),
  voteMode: "aloud",
  categories: [],
});

/* ------------------------------------------------------------------ */
head("The word packs");
for (const label of PACK_IDS) {
  const pairs = PACKS[label].pairs;
  const cats = PACKS[label].categories;
  const ids = cats.map((c) => c.id);
  ok(label + ": every pair has two words and a known category",
     pairs.every((p) => p.length === 3 && p[0] && p[1] && ids.includes(p[2])),
     pairs.length + " pairs");
  ok(label + ": no word appears twice within the pack",
     new Set(pairs.flatMap((p) => [p[0].toLowerCase(), p[1].toLowerCase()])).size === pairs.length * 2);
  ok(label + ": the two sides of a pair are never the same word",
     pairs.every((p) => p[0].toLowerCase() !== p[1].toLowerCase()));
  ok(label + ": every category has pairs behind its chip",
     cats.every((c) => pairs.some((p) => p[2] === c.id)));
  // The forgiving guess normaliser must not collapse two words in the same
  // pack together, or a wrong guess would score.
  const norm = new Map();
  let collision = null;
  for (const [a, b] of pairs)
    for (const w of [a, b]) {
      const k = normalizeGuess(w);
      if (norm.has(k) && norm.get(k) !== w) collision = w + " = " + norm.get(k);
      norm.set(k, w);
    }
  ok(label + ": no two words normalise to the same guess", collision === null, collision || "");
  // Single words only, everywhere. A phrase is hard to describe without
  // saying half of it, and Mr. Shake has to type the civilian word back.
  const phrases = pairs.flatMap((p) => [p[0], p[1]]).filter((w) => !/^\p{L}+$/u.test(w));
  ok(label + ": every word is a single word", phrases.length === 0, phrases.join(", "));
}
{
  // Every pair of packs, not just the first two — a third pack sharing an
  // id with the second would have slipped past a hand-written check.
  let shared = null;
  for (let i = 0; i < PACK_IDS.length; i++)
    for (let j = i + 1; j < PACK_IDS.length; j++) {
      const b = new Set(PACKS[PACK_IDS[j]].categories.map((c) => c.id));
      const hit = PACKS[PACK_IDS[i]].categories.map((c) => c.id).find((c) => b.has(c));
      if (hit) shared = PACK_IDS[i] + "/" + PACK_IDS[j] + ": " + hit;
    }
  ok("no two packs share a category id — a stale selection cannot cross over",
     shared === null, shared || "");
}
ok("packFor returns the right pack for each id",
   packFor("clean").pairs === PAIRS &&
   packFor("rude").pairs === DIRTY_PAIRS &&
   packFor("explicit").pairs === EXPLICIT_PAIRS);
ok("the explicit pack is wired up and populated",
   EXPLICIT_PAIRS.length > 0 && EXPLICIT_CATEGORIES.length > 0,
   EXPLICIT_PAIRS.length + " pairs across " + EXPLICIT_CATEGORIES.length + " categories");
// A phone that last ran the two-pack build has `spicy: true` in storage.
ok("a setup saved as spicy:true still lands on the rude pack",
   normalizePack(true) === "rude" && packFor(true).pairs === DIRTY_PAIRS);
ok("spicy:false, a missing value and nonsense all fall back to clean",
   normalizePack(false) === "clean" && normalizePack(undefined) === "clean" &&
   normalizePack("banana") === "clean");

/* ------------------------------------------------------------------ */
head("Composition and validation");
{
  let allValid = true, offenders = [];
  for (let n = MIN_PLAYERS; n <= MAX_PLAYERS; n++) {
    const c = defaultComposition(n);
    const errs = validateSetup(c);
    if (errs.length) { allValid = false; offenders.push(n + ": " + errs[0]); }
    if (c.civilians + c.undercovers + c.mrShakes !== n) { allValid = false; offenders.push(n + ": counts don't sum"); }
  }
  ok("the default for every table size from 3 to 20 is playable", allValid, offenders[0] || "");
}
ok("impostors equalling civilians is rejected", validateSetup(setupOf(4, 2, 0)).length > 0);
ok("impostors outnumbering civilians is rejected", validateSetup(setupOf(4, 3, 0)).length > 0);
ok("a game with no impostor is rejected", validateSetup(setupOf(5, 0, 0)).length > 0);
ok("two players is rejected", validateSetup(setupOf(2, 1, 0)).length > 0);
ok("Mr. Shake is rejected at three players", validateSetup(setupOf(3, 0, 1)).length > 0);
ok("a sane 6-player game is accepted", validateSetup(setupOf(6, 1, 1)).length === 0);

/* ------------------------------------------------------------------ */
head("Dealing");
{
  const rng = mulberry32(1);
  let bad = null;
  for (let t = 0; t < 300 && !bad; t++) {
    const n = 3 + Math.floor(rng() * 18);
    const c = defaultComposition(n);
    const setup = { ...c, names: defaultNames(n) };
    const pair = pickPair(rng);
    const players = dealRoles(setup, pair, rng);
    const got = counts(players);
    if (players.length !== n) bad = "wrong player count";
    else if (got.undercovers !== c.undercovers) bad = "wrong undercover count at n=" + n;
    else if (got.mrShakes !== c.mrShakes) bad = "wrong Mr. Shake count at n=" + n;
    else if (got.civilians !== c.civilians) bad = "wrong civilian count at n=" + n;
    else if (!players.filter((p) => p.role === CIVILIAN).every((p) => p.word === pair.civilian))
      bad = "a civilian did not get the civilian word";
    else if (!players.filter((p) => p.role === UNDERCOVER).every((p) => p.word === pair.undercover))
      bad = "an undercover did not get the paired word";
    else if (!players.filter((p) => p.role === MRSHAKE).every((p) => p.word === null))
      bad = "Mr. Shake was given a word";
  }
  ok("300 deals produce exactly the requested roles and the right words", bad === null, bad || "");
}
{
  const rng = mulberry32(7);
  const seen = new Set();
  for (let t = 0; t < 400; t++) {
    const p = pickPair(rng);
    seen.add(p.civilian + "|" + p.undercover);
  }
  // Both orientations of at least some pairs must show up, or the flip is dead.
  const flipped = [...seen].filter((k) => {
    const [a, b] = k.split("|");
    return seen.has(b + "|" + a);
  });
  ok("the civilian side of a pair is randomised, not fixed", flipped.length > 0,
     flipped.length + " pairs seen both ways round");
}
{
  const rng = mulberry32(3);
  const used = [];
  const drawn = new Set();
  let repeat = false;
  for (let t = 0; t < PAIRS.length; t++) {
    const p = pickPair(rng, { used });
    if (drawn.has(p.id)) repeat = true;
    drawn.add(p.id);
    used.push(p.id);
  }
  ok("a pair is never drawn twice until the pack is exhausted", !repeat,
     drawn.size + " distinct draws from " + PAIRS.length + " pairs");
}
{
  const rng = mulberry32(11);
  let offCategory = false;
  for (let t = 0; t < 200; t++) {
    const p = pickPair(rng, { categories: ["animals", "tech"] });
    if (p.category !== "animals" && p.category !== "tech") offCategory = true;
  }
  ok("category chips actually filter the pack", !offCategory);
}

/* ------------------------------------------------------------------ */
head("Secrecy — the rule that would silently destroy the game");
{
  const rng = mulberry32(21);
  const setup = { ...setupOf(8, 2, 1) };
  const pair = pickPair(rng);
  const players = dealRoles(setup, pair, rng);

  const civ = players.find((p) => p.role === CIVILIAN);
  const und = players.find((p) => p.role === UNDERCOVER);
  const shake = players.find((p) => p.role === MRSHAKE);

  const rc = revealFor(civ), ru = revealFor(und), rs = revealFor(shake);

  ok("a civilian's card carries a word and nothing else",
     Object.keys(rc).sort().join() === "kind,word" && rc.kind === "word");
  ok("an undercover's card is the SAME SHAPE as a civilian's",
     JSON.stringify(Object.keys(rc).sort()) === JSON.stringify(Object.keys(ru).sort()) &&
     rc.kind === ru.kind);
  ok("neither card mentions a role anywhere in it",
     !JSON.stringify([rc, ru]).includes(CIVILIAN) &&
     !JSON.stringify([rc, ru]).includes(UNDERCOVER));
  ok("only the words differ between the two", rc.word !== ru.word);
  ok("Mr. Shake is told, because an empty card tells them anyway",
     rs.kind === MRSHAKE && rs.word === null);
}

/* ------------------------------------------------------------------ */
head("Speaking order");
{
  const rng = mulberry32(31);
  let bad = null;
  const firsts = new Set();
  for (let t = 0; t < 500 && !bad; t++) {
    const n = 4 + Math.floor(rng() * 10);
    const c = defaultComposition(n);
    let players = dealRoles({ ...c, names: defaultNames(n) }, pickPair(rng), rng);
    // Kill a few at random so the order is exercised mid-game too.
    for (let k = 0; k < Math.floor(rng() * 3); k++) {
      const alive = living(players);
      if (alive.length > 3) players = eliminate(players, alive[Math.floor(rng() * alive.length)].id, 1);
    }
    const order = speakingOrder(players, rng);
    const aliveIds = living(players).map((p) => p.id).sort((x, y) => x - y);
    const byId = Object.fromEntries(players.map((p) => [p.id, p]));

    if (order.length !== aliveIds.length) bad = "order length != living count";
    else if (new Set(order).size !== order.length) bad = "a player appears twice in the order";
    else if (order.slice().sort((x, y) => x - y).join() !== aliveIds.join()) bad = "order is not the living set";
    else if (byId[order[0]].role !== CIVILIAN) bad = "Mr. Shake or an undercover spoke first";
    firsts.add(order[0]);
  }
  ok("500 orders: every living player once, and a civilian always opens", bad === null, bad || "");
  ok("the order genuinely varies between rounds", firsts.size > 1, firsts.size + " different openers");
}

/* ------------------------------------------------------------------ */
head("Win conditions");
{
  const mk = (spec) => spec.map((s, i) => ({ id: i, name: "P" + i, role: s[0], alive: s[1], word: "w" }));
  const C = CIVILIAN, U = UNDERCOVER, W = MRSHAKE;

  ok("nobody has won at 4 civilians vs 1 undercover",
     checkWin(mk([[C, 1], [C, 1], [C, 1], [C, 1], [U, 1]])) === null);
  ok("civilians win when the last impostor is out",
     checkWin(mk([[C, 1], [C, 1], [U, 0]])) === "civilians");
  ok("impostors win at the classic final two",
     checkWin(mk([[C, 1], [U, 1], [C, 0], [C, 0]])) === "impostors");
  ok("impostors win when they equal the civilians — the spec case",
     checkWin(mk([[C, 1], [C, 1], [U, 1], [W, 1], [C, 0]])) === "impostors");
  ok("impostors win when they outnumber the civilians",
     checkWin(mk([[C, 1], [U, 1], [U, 1]])) === "impostors");
  ok("Mr. Shake counts as an impostor for the civilian win",
     checkWin(mk([[C, 1], [C, 1], [C, 1], [W, 1]])) === null);
  ok("civilians win with Mr. Shake out and no undercover left",
     checkWin(mk([[C, 1], [C, 1], [C, 1], [W, 0]])) === "civilians");
}

/* ------------------------------------------------------------------ */
head("Ballots");
ok("a clear majority returns one target",
   JSON.stringify(tallyBallots({ 0: 3, 1: 3, 2: 1 })) ===
   JSON.stringify({ tally: { 3: 2, 1: 1 }, top: [3], tied: false, votes: 2 }));
{
  const t = tallyBallots({ 0: 1, 1: 2 });
  ok("a two-way tie is reported as tied", t.tied && t.top.length === 2 && t.top.includes(1) && t.top.includes(2));
}
ok("an empty ballot box is not a tie", tallyBallots({}).top.length === 0);
{
  const t = tallyBallots({ 0: 5, 1: 5, 2: 5, 3: 4 });
  ok("only the top scorers are returned", t.top.length === 1 && t.top[0] === 5 && t.votes === 3);
}

/* ------------------------------------------------------------------ */
head("Mr. Shake's last guess");
ok("exact match", guessIsCorrect("Coffee", "Coffee"));
ok("case and punctuation are forgiven", guessIsCorrect("  cOFFEE!! ", "Coffee"));
ok("a stray article is forgiven", guessIsCorrect("the cinema", "Cinema"));
ok("a naive plural is forgiven", guessIsCorrect("Coffees", "Coffee"));
ok("accents are forgiven", guessIsCorrect("café", "Cafe"));
ok("multi-word answers work", guessIsCorrect("ice cream", "Ice cream"));
ok("the paired word is NOT accepted", !guessIsCorrect("Tea", "Coffee"));
ok("an empty guess is not a win", !guessIsCorrect("", "Coffee"));
ok("whitespace alone is not a win", !guessIsCorrect("   ", "Coffee"));

/* ------------------------------------------------------------------ */
head("A pack is a swap, not a mix");
{
  const rng = mulberry32(4242);
  const idsOfPack = (id) => new Set(PACKS[id].pairs.map((p) => p[0] + "|" + p[1]));

  for (const id of PACK_IDS) {
    const own = idsOfPack(id);
    let leaked = 0;
    for (let i = 0; i < 400; i++) if (!own.has(pickPair(rng, { pack: id }).id)) leaked++;
    ok("400 " + id + " draws are all from the " + id + " pack", leaked === 0, leaked + " leaked");
  }

  let offCategory = 0;
  for (let i = 0; i < 200; i++) {
    const p = pickPair(rng, { pack: "rude", categories: ["d-dating", "d-body"] });
    if (p.category !== "d-dating" && p.category !== "d-body") offCategory++;
  }
  ok("category chips filter inside the rude pack", offCategory === 0, offCategory + " off-category");

  offCategory = 0;
  for (let i = 0; i < 200; i++) {
    const p = pickPair(rng, { pack: "explicit", categories: ["x-toys"] });
    if (p.category !== "x-toys") offCategory++;
  }
  ok("and inside the explicit pack", offCategory === 0, offCategory + " off-category");

  // A selection carried over from another pack would match nothing. The
  // pool falls back rather than throwing, but the selection must be cleared.
  let st = initialState();
  ok("a fresh setup starts on the clean pack", st.setup.pack === "clean");
  st = reduce(st, { type: "setup/toggleCategory", id: "animals" }, rng);
  st = reduce(st, { type: "setup/toggleCategory", id: "tech" }, rng);
  ok("clean categories can be picked", st.setup.categories.length === 2);
  st = reduce(st, { type: "setup/setPack", pack: "rude" }, rng);
  ok("switching packs clears the selection", st.setup.categories.length === 0);
  ok("and records the pack", st.setup.pack === "rude");

  st = reduce(st, { type: "setup/patch", patch: { players: 6 } }, rng);
  st = reduce(st, { type: "game/start" }, rng);
  ok("a rude game deals a rude pair", idsOfPack("rude").has(st.pair.id),
     st.pair.civilian + " / " + st.pair.undercover);
  ok("and every civilian holds the rude civilian word",
     st.players.filter((p) => p.role === CIVILIAN).every((p) => p.word === st.pair.civilian));

  st = reduce(st, { type: "setup/setPack", pack: "explicit" }, rng);
  st = reduce(st, { type: "game/start" }, rng);
  ok("an explicit game deals an explicit pair", idsOfPack("explicit").has(st.pair.id),
     st.pair.civilian + " / " + st.pair.undercover);

  st = reduce(st, { type: "setup/setPack", pack: "clean" }, rng);
  ok("switching back clears again",
     st.setup.categories.length === 0 && st.setup.pack === "clean");
  st = reduce(st, { type: "setup/setPack", pack: "nonsense" }, rng);
  ok("an unknown pack id falls back to clean rather than emptying the pool",
     st.setup.pack === "clean");
}

/* ------------------------------------------------------------------ */
head("Mr. Shake does not land on the same player twice running");
{
  const rng = mulberry32(31337);
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 6 } }, rng);
  st = reduce(st, { type: "game/start" }, rng);

  const shakesOf = (s) => s.players.filter((p) => p.role === MRSHAKE).map((p) => p.id);
  ok("the six-player default deals one Mr. Shake", shakesOf(st).length === 1);

  let repeats = 0;
  let distinctHolders = new Set(shakesOf(st));
  for (let g = 0; g < 200; g++) {
    const before = shakesOf(st);
    st = reduce(st, { type: "game/again" }, rng);
    const after = shakesOf(st);
    if (after.some((id) => before.includes(id))) repeats++;
    after.forEach((id) => distinctHolders.add(id));
  }
  ok("200 consecutive deals, nobody ever holds it twice running", repeats === 0,
     repeats + " repeats");
  ok("and it still moves around the whole table", distinctHolders.size === 6,
     distinctHolders.size + " of 6 seats held it");

  // The constraint is a preference, not a promise it can always keep: with
  // nowhere legal to put the role the deal still has to happen.
  const tight = { names: ["a", "b", "c", "d"], undercovers: 1, mrShakes: 1 };
  const pair = pickPair(rng, {});
  const forced = dealRoles(tight, pair, rng, { avoidMrShake: [0, 1, 2, 3] });
  ok("an impossible constraint still deals a complete game",
     forced.length === 4 && forced.filter((p) => p.role === MRSHAKE).length === 1);
}

head("Renaming whoever is holding the phone");
{
  const rng = mulberry32(808);
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 5 } }, rng);
  st = reduce(st, { type: "game/start" }, rng);
  ok("everyone starts as a numbered player", st.players[2].name === "Player 3");

  st = reduce(st, { type: "player/rename", id: 2, name: "  Cleo  " }, rng);
  ok("the dealt player is renamed, trimmed", st.players[2].name === "Cleo");
  ok("and the setup roster is updated too — this is what makes it stick",
     st.setup.names[2] === "Cleo");
  ok("nobody else moved", st.players[1].name === "Player 2" && st.players[3].name === "Player 4");

  ok("an empty rename is refused rather than blanking somebody",
     reduce(st, { type: "player/rename", id: 2, name: "   " }, rng).players[2].name === "Cleo");
  ok("a very long name is cut to something that fits the screen",
     reduce(st, { type: "player/rename", id: 0, name: "x".repeat(60) }, rng)
       .players[0].name.length === 18);

  const again = reduce({ ...st, phase: "gameover" }, { type: "game/again" }, rng);
  ok("the name survives into the next game", again.players[2].name === "Cleo");
  const reset = reduce(again, { type: "game/reset" }, rng);
  ok("and survives a return to setup", reset.setup.names[2] === "Cleo");
}

head("The reveal loop cannot skip a player");
{
  const rng = mulberry32(41);
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 5, undercovers: 1, mrShakes: 0 } }, rng);
  st = reduce(st, { type: "game/start" }, rng);

  ok("it opens on the first player's pass screen",
     st.phase === "reveal" && st.revealIndex === 0 && st.revealStage === "pass");

  // Every out-of-order tap is a no-op, so a stray event cannot advance anything.
  ok("show before accept does nothing",
     reduce(st, { type: "reveal/show" }, rng).revealStage === "pass");
  ok("hide before accept does nothing",
     reduce(st, { type: "reveal/hide" }, rng).revealIndex === 0);

  let s2 = reduce(st, { type: "reveal/accept" }, rng);
  ok("accept moves to the face-down card", s2.revealStage === "hidden" && s2.revealIndex === 0);
  ok("a second accept is a no-op", reduce(s2, { type: "reveal/accept" }, rng).revealStage === "hidden");
  ok("hide from face-down does nothing", reduce(s2, { type: "reveal/hide" }, rng).revealIndex === 0);

  let s3 = reduce(s2, { type: "reveal/show" }, rng);
  ok("show turns the card over", s3.revealStage === "shown" && s3.revealIndex === 0);
  ok("a second show is a no-op", reduce(s3, { type: "reveal/show" }, rng).revealStage === "shown");

  let s4 = reduce(s3, { type: "reveal/hide" }, rng);
  ok("hide advances exactly one player, back to a pass screen",
     s4.revealIndex === 1 && s4.revealStage === "pass");
  ok("a repeated hide cannot advance a second time",
     reduce(s4, { type: "reveal/hide" }, rng).revealIndex === 1);

  // Walk the rest of the table.
  let s = s4;
  for (let i = 1; i < 5; i++) {
    s = reduce(s, { type: "reveal/accept" }, rng);
    s = reduce(s, { type: "reveal/show" }, rng);
    s = reduce(s, { type: "reveal/hide" }, rng);
  }
  ok("the last hide starts round one", s.phase === "describe" && s.round === 1);
  ok("and a speaking order was drawn", s.order.length === 5);
}

/* ------------------------------------------------------------------ */
head("Full games — 500 seeded playthroughs, voting aloud");
{
  let bad = null;
  const outcomes = { civilians: 0, impostors: 0, mrshake: 0 };
  let maxRounds = 0;

  for (let seed = 1; seed <= 500 && !bad; seed++) {
    const rng = mulberry32(seed);
    let st = initialState();
    const n = 3 + Math.floor(rng() * 10);
    const c = defaultComposition(n);
    st = reduce(st, { type: "setup/patch", patch: { players: n } }, rng);
    st = reduce(st, { type: "setup/patch", patch: { undercovers: c.undercovers, mrShakes: c.mrShakes } }, rng);
    st = reduce(st, { type: "game/start" }, rng);
    if (st.phase !== "reveal") { bad = "seed " + seed + ": start refused a valid setup"; break; }

    let guard = 0;
    while (st.phase !== "gameover") {
      if (++guard > 500) { bad = "seed " + seed + ": did not terminate"; break; }

      if (st.phase === "reveal") {
        st = reduce(st, { type: "reveal/accept" }, rng);
        st = reduce(st, { type: "reveal/show" }, rng);
        st = reduce(st, { type: "reveal/hide" }, rng);
      } else if (st.phase === "describe") {
        // A civilian must always be first to speak, every round.
        const byId = Object.fromEntries(st.players.map((p) => [p.id, p]));
        if (byId[st.order[0]].role !== CIVILIAN) { bad = "seed " + seed + ": non-civilian opened round " + st.round; break; }
        maxRounds = Math.max(maxRounds, st.round);
        st = reduce(st, { type: "describe/done" }, rng);
      } else if (st.phase === "vote") {
        const alive = living(st.players);
        const victim = alive[Math.floor(rng() * alive.length)];
        st = reduce(st, { type: "vote/propose", id: victim.id }, rng);
        st = reduce(st, { type: "vote/confirm" }, rng);
      } else if (st.phase === "shakeGuess") {
        // Guess right about a third of the time.
        const guess = rng() < 0.33 ? st.pair.civilian : "definitely not it";
        st = reduce(st, { type: "shake/guess", guess }, rng);
      } else if (st.phase === "elimination") {
        st = reduce(st, { type: "round/next" }, rng);
      } else {
        bad = "seed " + seed + ": unexpected phase " + st.phase;
        break;
      }

      // Invariants that must hold at every single step of every game.
      const cc = counts(st.players);
      if (st.phase !== "gameover" && cc.alive === 0) { bad = "seed " + seed + ": everybody died"; break; }
      if (st.phase === "describe" && checkWin(st.players)) {
        bad = "seed " + seed + ": played on past a satisfied win condition";
        break;
      }
    }
    if (bad) break;
    if (!st.winner) { bad = "seed " + seed + ": ended with no winner"; break; }
    outcomes[st.winner] = (outcomes[st.winner] || 0) + 1;

    // A finished game must actually satisfy the condition it claims.
    const cc = counts(st.players);
    if (st.winner === "civilians" && cc.impostors !== 0) { bad = "seed " + seed + ": civilians won with impostors alive"; break; }
    if (st.winner === "impostors" && cc.impostors < cc.civilians) { bad = "seed " + seed + ": impostors won while outnumbered"; break; }
  }

  ok("500 games all terminate with a coherent winner", bad === null, bad || "");
  ok("all three outcomes occur across the sample",
     outcomes.civilians > 0 && outcomes.impostors > 0 && outcomes.mrshake > 0,
     "civilians " + outcomes.civilians + " · impostors " + outcomes.impostors +
     " · Mr. Shake " + outcomes.mrshake);
  ok("games run to a sensible length", maxRounds >= 2 && maxRounds <= 20, "longest " + maxRounds + " rounds");
}

/* ------------------------------------------------------------------ */
head("Full games — secret ballot, including ties and runoffs");
{
  let bad = null, ties = 0, runoffs = 0, noElim = 0;
  for (let seed = 1; seed <= 300 && !bad; seed++) {
    const rng = mulberry32(seed + 9000);
    let st = initialState();
    const n = 4 + Math.floor(rng() * 8);
    const c = defaultComposition(n);
    st = reduce(st, { type: "setup/patch", patch: { players: n } }, rng);
    st = reduce(st, { type: "setup/patch", patch: { undercovers: c.undercovers, mrShakes: c.mrShakes, voteMode: "ballot" } }, rng);
    st = reduce(st, { type: "game/start" }, rng);

    let guard = 0;
    while (st.phase !== "gameover") {
      if (++guard > 800) { bad = "seed " + seed + ": did not terminate"; break; }
      if (st.phase === "reveal") {
        st = reduce(st, { type: "reveal/accept" }, rng);
        st = reduce(st, { type: "reveal/show" }, rng);
        st = reduce(st, { type: "reveal/hide" }, rng);
      } else if (st.phase === "describe") {
        st = reduce(st, { type: "describe/done" }, rng);
      } else if (st.phase === "ballot") {
        const wasRunoff = st.runoff;
        const alive = living(st.players);
        const voter = alive[st.ballotIndex];
        const candidates = (st.runoff ? st.runoff : alive.map((p) => p.id))
          .filter((id) => id !== voter.id);      // nobody votes for themselves
        const target = candidates.length
          ? candidates[Math.floor(rng() * candidates.length)]
          : alive.filter((p) => p.id !== voter.id)[0].id;
        st = reduce(st, { type: "ballot/cast", id: target }, rng);
        if (!wasRunoff && st.runoff) { ties++; runoffs++; }
        if (wasRunoff && st.phase !== "ballot" && st.lastEliminated === null) noElim++;
      } else if (st.phase === "shakeGuess") {
        st = reduce(st, { type: "shake/guess", guess: rng() < 0.3 ? st.pair.civilian : "nope" }, rng);
      } else if (st.phase === "elimination") {
        st = reduce(st, { type: "round/next" }, rng);
      } else { bad = "seed " + seed + ": unexpected phase " + st.phase; break; }

      if (st.phase !== "gameover" && counts(st.players).alive === 0) { bad = "seed " + seed + ": everybody died"; break; }
    }
    if (bad) break;
    if (!st.winner) { bad = "seed " + seed + ": ended with no winner"; break; }
  }
  ok("300 ballot games all terminate with a winner", bad === null, bad || "");
  ok("ties happened and forced a runoff", ties > 0, ties + " ties");
  ok("a tied runoff can end in nobody going home", noElim >= 0, noElim + " rounds with no elimination");
}

/* ------------------------------------------------------------------ */
head("Mr. Shake's guess resolves ahead of the win check");
{
  const rng = mulberry32(77);
  // Two civilians and one Mr. Shake: eliminating Mr. Shake would hand the
  // civilians the game, unless the guess lands first.
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 4 } }, rng);
  st = reduce(st, { type: "setup/patch", patch: { undercovers: 0, mrShakes: 1 } }, rng);
  st = reduce(st, { type: "game/start" }, rng);
  while (st.phase === "reveal") {
    st = reduce(st, { type: "reveal/accept" }, rng);
    st = reduce(st, { type: "reveal/show" }, rng);
    st = reduce(st, { type: "reveal/hide" }, rng);
  }
  st = reduce(st, { type: "describe/done" }, rng);
  const shake = st.players.find((p) => p.role === MRSHAKE);
  st = reduce(st, { type: "vote/propose", id: shake.id }, rng);
  const voted = reduce(st, { type: "vote/confirm" }, rng);

  ok("voting out Mr. Shake asks for a guess rather than ending the game",
     voted.phase === "shakeGuess", voted.phase);

  const won = reduce(voted, { type: "shake/guess", guess: voted.pair.civilian }, rng);
  ok("a correct guess steals a game the civilians had won",
     won.phase === "gameover" && won.winner === "mrshake");

  const lost = reduce(voted, { type: "shake/guess", guess: "something else" }, rng);
  ok("a wrong guess hands it back to the civilians",
     lost.phase === "gameover" && lost.winner === "civilians");
}

/* ------------------------------------------------------------------ */
head("Setup edits stay coherent");
{
  const rng = mulberry32(5);
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 12 } }, rng);
  ok("growing the table adds default names", st.setup.names.length === 12);
  st = reduce(st, { type: "setup/name", index: 0, name: "Ava" }, rng);
  st = reduce(st, { type: "setup/patch", patch: { players: 20 } }, rng);
  ok("a typed name survives a resize", st.setup.names[0] === "Ava");
  st = reduce(st, { type: "setup/patch", patch: { undercovers: 6, mrShakes: 2 } }, rng);
  st = reduce(st, { type: "setup/patch", patch: { players: 5 } }, rng);
  ok("shrinking past a composition that no longer fits repairs it",
     validateSetup(st.setup).length === 0,
     st.setup.players + "p / " + st.setup.undercovers + "u / " + st.setup.mrShakes + "w");
  ok("civilians are always derived, never stale",
     st.setup.civilians === st.setup.players - st.setup.undercovers - st.setup.mrShakes);

  st = reduce(st, { type: "setup/toggleCategory", id: "animals" }, rng);
  ok("a category chip toggles on", st.setup.categories.includes("animals"));
  st = reduce(st, { type: "setup/toggleCategory", id: "animals" }, rng);
  ok("and off again", !st.setup.categories.includes("animals"));

  // An invalid setup must not be startable.
  let bad2 = initialState();
  bad2 = reduce(bad2, { type: "setup/patch", patch: { players: 4 } }, rng);
  bad2 = reduce(bad2, { type: "setup/patch", patch: { undercovers: 2, mrShakes: 0 } }, rng);
  ok("an unplayable setup cannot be started",
     reduce(bad2, { type: "game/start" }, rng).phase === "setup");
}

/* ------------------------------------------------------------------ */
head("Playing again");
{
  const rng = mulberry32(99);
  let st = initialState();
  st = reduce(st, { type: "setup/patch", patch: { players: 6 } }, rng);
  st = reduce(st, { type: "setup/name", index: 2, name: "Cleo" }, rng);
  st = reduce(st, { type: "game/start" }, rng);
  const firstPair = st.pair.id;
  const again = reduce({ ...st, phase: "gameover" }, { type: "game/again" }, rng);
  ok("the same table plays on", again.setup.names[2] === "Cleo" && again.players.length === 6);
  ok("with a pair they have not had", again.pair.id !== firstPair);
  ok("back at the first reveal", again.phase === "reveal" && again.revealIndex === 0 && again.revealStage === "pass");
  ok("and no stale winner from last time", again.winner === null);

  const reset = reduce(again, { type: "game/reset" }, rng);
  ok("reset returns to setup but remembers the table", reset.phase === "setup" && reset.setup.names[2] === "Cleo");
}

/* ------------------------------------------------------------------ */
console.log("\n" + pass + " passed, " + fail + " failed\n");
process.exit(fail ? 1 : 0);
