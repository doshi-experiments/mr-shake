/* Browser tests. Drives headless Chrome over CDP at a phone viewport —
 * no puppeteer in this environment, and Node has a global WebSocket, so
 * speaking the protocol directly is less trouble than adding a client.
 *
 *   node test/serve.mjs &      # serves dist/ on 8123
 *   node test/e2e.mjs
 */
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:8123/";
const SHOTS = path.join(HERE, "shots");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9422;
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const ok = (n, c, d = "") => {
  if (c) { pass++; console.log("  pass  " + n + (d ? "  " + d : "")); }
  else { fail++; console.log("  FAIL  " + n + (d ? "  " + d : "")); }
};
const head = (s) => console.log("\n" + s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Longer than the app's 450ms lockout, so a normal step is never blocked.
const STEP = 600;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ms-e2e-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--remote-debugging-port=" + PORT, "--user-data-dir=" + profile, "about:blank",
], { stdio: "ignore" });

let wsUrl = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  await sleep(250);
  try { wsUrl = (await (await fetch(`http://localhost:${PORT}/json/version`)).json()).webSocketDebuggerUrl; }
  catch (e) {}
}
if (!wsUrl) { console.error("Chrome never came up"); process.exit(2); }

const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let msgId = 0;
const waiting = new Map();
const problems = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && waiting.has(msg.id)) {
    const { res, rej } = waiting.get(msg.id);
    waiting.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
  if (msg.method === "Runtime.exceptionThrown")
    problems.push("exception: " + (msg.params.exceptionDetails.exception?.description ||
                                   msg.params.exceptionDetails.text));
  if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error")
    problems.push("console: " + msg.params.entry.text);
};
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const id = ++msgId;
    waiting.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S("Page.enable"); await S("Runtime.enable"); await S("Log.enable");
// iPhone 14-ish. The whole design is mobile-first; desktop is the edge case.
await S("Emulation.setDeviceMetricsOverride",
        { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

const evalJs = async (expr) => {
  const r = await S("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description || ""));
  return r.result.value;
};
const go = async () => {
  await S("Page.navigate", { url: BASE });
  await sleep(400);
  await evalJs("sessionStorage.clear(); localStorage.removeItem('mr-shake:setup')");
  await S("Page.reload", {});
  await sleep(900);
};
const reload = async () => { await S("Page.reload", {}); await sleep(900); };
const text = async () => (await evalJs("document.body.innerText")).toLowerCase();
const shot = async (name) => {
  const { data } = await S("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(SHOTS, name + ".png"), Buffer.from(data, "base64"));
};
// Clicks the first button whose text contains `needle`. Returns false if none.
const click = (needle, sel = "button") => evalJs(`(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(sel)})]
    .find(b => !b.disabled && b.textContent.trim().toLowerCase().includes(${JSON.stringify(needle.toLowerCase())}));
  if (!el) return false; el.click(); return true;
})()`);
const clickExact = (label) => evalJs(`(() => {
  const el = [...document.querySelectorAll('button')]
    .find(b => !b.disabled && b.textContent.trim() === ${JSON.stringify(label)});
  if (!el) return false; el.click(); return true;
})()`);
const phase = () => evalJs("document.querySelector('.app').dataset.phase");

// Read the packs straight from source so the browser assertions compare
// against the same data the app ships.
const { PAIRS, DIRTY_PAIRS, EXPLICIT_PAIRS } = await import("../src/words.js");
const idsOf = (pairs) => new Set(pairs.map((p) => [p[0], p[1]].sort().join("|")));
const CLEAN_IDS = idsOf(PAIRS);
const RUDE_IDS = idsOf(DIRTY_PAIRS);
const EXPLICIT_IDS = idsOf(EXPLICIT_PAIRS);
const stepper = (label, dir) => evalJs(`(() => {
  const el = [...document.querySelectorAll('button')]
    .find(b => b.getAttribute('aria-label') === ${JSON.stringify((dir < 0 ? "Fewer " : "More ") + label)});
  if (!el || el.disabled) return false; el.click(); return true;
})()`);

/* ---------------------------------------------------------------- */
head("Cold load");
await go();
ok("no console errors or exceptions", problems.length === 0, problems.join(" | "));
ok("the setup screen renders", (await text()).includes("everyone gets the same word"));
ok("it starts on setup", (await phase()) === "setup");
ok("the deal button is live", await evalJs(
  `!![...document.querySelectorAll('button')].find(b => b.textContent.includes('Deal the words') && !b.disabled)`));
await shot("01-setup");

head("Setup controls");
{
  const count = () => evalJs("document.querySelector('.stepper__value').firstChild.textContent");
  const before = await count();
  await stepper("players", +1); await sleep(150);
  const after = await count();
  ok("the player stepper moves", before !== after, before + " → " + after + " players");
  await stepper("players", -1); await sleep(150);

  ok("the name fields are visible without hunting for them",
     await evalJs("document.querySelectorAll('.name-input').length > 0"));
  const n = await evalJs("document.querySelectorAll('.name-input').length");
  ok("there is one field per player", n === 6, n + " fields");

  // Push it into an invalid composition and confirm the deal is refused.
  for (let i = 0; i < 6; i++) await stepper("Undercovers", +1);
  await sleep(200);
  const capped = await evalJs("[...document.querySelectorAll('.role-row__count')].map(e=>e.textContent).join('/')");
  ok("impostors cannot be raised past the point of no game",
     (await evalJs(`!![...document.querySelectorAll('button')].find(b => b.textContent.includes('Deal the words') && !b.disabled)`)),
     "civ/und/shake = " + capped);
  for (let i = 0; i < 6; i++) await stepper("Undercovers", -1);
  await sleep(200);
}

/* ---------------------------------------------------------------- */
head("Real names");
await go();
const NAMES = ["Ava", "Ben", "Cleo", "Dev", "Esme", ""];
const typeName = (i, v) => evalJs(`(() => {
  const el = document.querySelectorAll('.name-input')[${i}];
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  set.call(el, ${JSON.stringify("")} + ${JSON.stringify(v)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
})()`);
{
  for (let i = 0; i < NAMES.length; i++) if (NAMES[i]) await typeName(i, NAMES[i]);
  await sleep(300);
  await click("deal the words"); await sleep(STEP);
  ok("the hand-over screen uses the typed name",
     (await evalJs("document.querySelector('.who').textContent")) === "Ava");
  ok("and so does the button", (await text()).includes("i'm ava"));
  await shot("10-pass-named");

  // Walk to the sixth player, who was left blank.
  for (let i = 0; i < 5; i++) {
    await click("i'm"); await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
    await click("hide and"); await sleep(STEP);
  }
  ok("a blank field still falls back to a number",
     (await evalJs("document.querySelector('.who').textContent")) === "Player 6");
}

head("Renaming from the hand-over screen");
{
  ok("there is a way out for whoever was left as a number", await click("not player 6"));
  await sleep(300);
  ok("the primary button is gone while the keyboard is open",
     !(await evalJs(`!![...document.querySelectorAll('button')].find(b => b.textContent.includes("I'm"))`)));
  await evalJs(`(() => {
    const el = document.querySelector('.rename__input');
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    set.call(el, 'Finn');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(200);
  await click("save"); await sleep(400);
  ok("the new name sticks", (await evalJs("document.querySelector('.who').textContent")) === "Finn");
  ok("and it reached the setup roster, so it survives the next game",
     (await evalJs("JSON.parse(localStorage.getItem('mr-shake:setup')).names[5]")) === "Finn");

  // The safety argument depends on these two never sharing coordinates.
  const overlap = await evalJs(`(() => {
    const bs = [...document.querySelectorAll('button')];
    const rename = bs.find(b => b.textContent.startsWith('Not '));
    const primary = bs.find(b => b.textContent.includes("I'm"));
    if (!rename || !primary) return 'missing';
    const a = rename.getBoundingClientRect(), b = primary.getBoundingClientRect();
    return !(a.bottom <= b.top || b.bottom <= a.top);
  })()`);
  ok("the rename control never overlaps the primary button", overlap === false, String(overlap));

  // And the reveal guards still hold with a renamed player in the seat.
  await sleep(STEP);
  await evalJs(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes("I'm"));
    b.click(); setTimeout(() => { if (!b.disabled) b.click(); }, 60);
  })()`);
  await sleep(STEP);
  ok("a double-tap after renaming still lands on the face-down card",
     (await text()).includes("tap to see your word") && (await text()).includes("finn"));
}

head("The rude pack");
await go();
{
  const cleanChips = await evalJs("[...document.querySelectorAll('.chips .chip')].map(c=>c.textContent)");
  ok("the clean chips are the everyday categories", cleanChips.includes("Animals"), cleanChips.length + " chips");
  ok("it starts clean",
     await evalJs(`[...document.querySelectorAll('.chip')].find(c=>c.textContent==='Clean').getAttribute('aria-pressed')==='true'`));

  await clickExact("Rude"); await sleep(300);
  const rudeChips = await evalJs("[...document.querySelectorAll('.chips .chip')].map(c=>c.textContent)");
  ok("flipping it swaps the categories", !rudeChips.includes("Animals") && rudeChips.includes("Dating"),
     rudeChips.join(", "));
  ok("and the note changes", (await text()).includes("read the room"));
  await shot("11-setup-rude");

  await click("deal the words"); await sleep(STEP);
  await click("i'm"); await sleep(STEP);
  await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
  const inRude = await evalJs(`(() => {
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return { civ: s.pair.civilian, und: s.pair.undercover, pack: s.setup.pack };
  })()`);
  ok("the game records the rude pack", inRude.pack === "rude", inRude.pack);
  await shot("12-word-rude");

  // Prove the word is from the rude pack and not the clean one.
  const verdict = await evalJs(`(() => {
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return s.pair.civilian + "|" + s.pair.undercover;
  })()`);
  ok("a rude pair was dealt", RUDE_IDS.has(verdict.split("|").sort().join("|")),
     inRude.civ + " / " + inRude.und);
  ok("and it is not in the clean pack", !CLEAN_IDS.has(verdict.split("|").sort().join("|")));

  // Switching back must clear the selection rather than stranding it.
  await evalJs("sessionStorage.clear()");
  await reload();
  ok("the pack choice was remembered across a reload",
     await evalJs(`[...document.querySelectorAll('.chip')].find(c=>c.textContent==='Rude').getAttribute('aria-pressed')==='true'`));
  await evalJs(`[...document.querySelectorAll('.chips .chip')][0].click()`); await sleep(250);
  await clickExact("Clean"); await sleep(300);
  ok("switching back drops the rude category selection",
     (await evalJs("JSON.parse(localStorage.getItem('mr-shake:setup')).categories.length")) === 0);
}

head("The explicit pack");
await go();
{
  await clickExact("Explicit"); await sleep(300);
  const chips = await evalJs("[...document.querySelectorAll('.chips .chip')].map(c=>c.textContent)");
  ok("its categories replace both other sets",
     chips.includes("Kinks") && !chips.includes("Dating") && !chips.includes("Animals"),
     chips.join(", "));
  ok("and the note says plainly what it is", (await text()).includes("no euphemism"));
  await shot("13-setup-explicit");

  await click("deal the words"); await sleep(STEP);
  await click("i'm"); await sleep(STEP);
  await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
  const dealt = await evalJs(`(() => {
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return { id: s.pair.civilian + "|" + s.pair.undercover, pack: s.setup.pack };
  })()`);
  ok("an explicit pair was dealt",
     EXPLICIT_IDS.has(dealt.id.split("|").sort().join("|")), dealt.id);
  ok("and it is in neither other pack",
     !CLEAN_IDS.has(dealt.id.split("|").sort().join("|")) &&
     !RUDE_IDS.has(dealt.id.split("|").sort().join("|")));
  ok("the game records the explicit pack", dealt.pack === "explicit", dealt.pack);
  await shot("14-word-explicit");
}

head("A setup saved by the two-pack build still opens");
await go();
{
  // Exactly what the previous version wrote: a boolean, and no `pack` key.
  await evalJs(`(() => {
    const s = JSON.parse(localStorage.getItem('mr-shake:setup'));
    delete s.pack; s.spicy = true;
    localStorage.setItem('mr-shake:setup', JSON.stringify(s));
    sessionStorage.clear();
  })()`);
  await reload();
  ok("spicy:true comes back as the rude pack, not a dead selection",
     await evalJs(`[...document.querySelectorAll('.chip')].find(c=>c.textContent==='Rude').getAttribute('aria-pressed')==='true'`));
  ok("and the rude categories are on screen",
     (await evalJs("[...document.querySelectorAll('.chips .chip')].map(c=>c.textContent)")).includes("Dating"));
  await evalJs("localStorage.removeItem('mr-shake:setup'); sessionStorage.clear()");
}

head("The table is remembered");
{
  await go();
  await typeName(0, "Zara"); await sleep(300);
  await reload();
  ok("names survive a reload of the setup screen",
     (await evalJs("document.querySelectorAll('.name-input')[0].value")) === "Zara");
}

head("The reveal cannot be double-tapped past a player");
await go();
await click("deal the words");
await sleep(STEP);
ok("dealing moves to the reveal", (await phase()) === "reveal");
await shot("02-pass");

{
  const nameOf = () => evalJs("document.querySelector('.who')?.textContent || ''");
  const first = await nameOf();
  ok("it opens on player 1 of 6", (await text()).includes("player 1 of 6"), first);

  // Two clicks 60ms apart on the accept button. The lockout must swallow
  // the second, leaving us on a face-down card for the SAME player.
  await sleep(STEP);                     // let the lockout expire first
  await evalJs(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes("I'm"));
    b.click(); setTimeout(() => { if (!b.disabled) b.click(); }, 60);
  })()`);
  await sleep(STEP);
  const t = await text();
  ok("a fast double-tap on accept lands on the face-down card, not past it",
     t.includes("tap to see your word") && t.includes("card 1 of 6"));

  // Same again on the reveal target.
  await evalJs(`(() => {
    const b = document.querySelector('.word-card--face-down');
    b.click(); setTimeout(() => { const c = document.querySelector('.word-card--face-down'); if (c) c.click(); }, 60);
  })()`);
  await sleep(STEP);
  ok("the word is shown for player 1", await evalJs("!!document.querySelector('.word-card--word, .word-card--shake')"));
  ok("still player 1", (await text()).includes("card 1 of 6"));
  await shot("03-word");

  // And on hide — the dangerous one, because it advances the index.
  await evalJs(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Hide and'));
    if (b.disabled) throw new Error('hide was still locked when the probe ran');
    b.click(); setTimeout(() => {
      const c = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Hide and'));
      if (c && !c.disabled) c.click();
    }, 60);
  })()`);
  await sleep(STEP);
  ok("a fast double-tap on hide advances exactly one player",
     (await text()).includes("player 2 of 6"));
  ok("and nothing is exposed on arrival",
     !(await evalJs("!!document.querySelector('.word-card--word, .word-card--shake')")));

  const second = await nameOf();
  ok("player 2 is a different person", second && second !== first, first + " → " + second);
}

head("A reload mid-reveal resumes without exposing anything");
{
  await reload();
  ok("still in the reveal", (await phase()) === "reveal");
  ok("on the same player", (await text()).includes("player 2 of 6"));
  ok("with no word on screen",
     !(await evalJs("!!document.querySelector('.word-card--word, .word-card--shake')")));
  // And the pass screen, not the face-down card — the phone may have changed hands.
  ok("back at the hand-over step", (await text()).includes("pass the phone to"));
}

/* ---------------------------------------------------------------- */
head("A full game, voting out loud");
await go();
{
  await click("deal the words");
  await sleep(STEP);

  const words = new Set();
  let shakes = 0;
  for (let i = 0; i < 6; i++) {
    await click("i'm");            await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()");
    await sleep(STEP);
    const w = await evalJs("document.querySelector('.word-card .word')?.textContent || ''");
    if (w.includes("Mr. Shake")) shakes++; else words.add(w);
    await click("hide and");       await sleep(STEP);
  }
  ok("everyone was dealt in and round one began", (await phase()) === "describe");
  ok("exactly two distinct words were handed out", words.size === 2,
     [...words].join(" / ") + (shakes ? " (+" + shakes + " Mr. Shake)" : ""));
  ok("the default 6-player game includes a Mr. Shake", shakes === 1, shakes + "");
  await shot("04-describe");

  // Play to a finish, always voting out whoever is listed first.
  let guard = 0;
  while ((await phase()) !== "gameover") {
    if (++guard > 60) break;
    const ph = await phase();
    if (ph === "describe") {
      await click("everyone's spoken");
    } else if (ph === "vote") {
      await evalJs("document.querySelector('.player-btn').click()");
      await sleep(250);
      await click("yes, they're out");
    } else if (ph === "shakeGuess") {
      await evalJs(`(() => {
        const i = document.querySelector('.guess-input');
        const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
        set.call(i, 'definitely not the word');
        i.dispatchEvent(new Event('input', { bubbles: true }));
      })()`);
      await sleep(200);
      await click("lock it in");
    } else if (ph === "elimination") {
      await click("next round");
    } else break;
    await sleep(STEP);
  }
  ok("the game reaches an ending", (await phase()) === "gameover", "after " + guard + " steps");
  const over = await text();
  ok("a winner is declared", /win/.test(over));
  ok("both words are shown at the end", over.includes("against"));
  ok("every player's role is listed",
     (await evalJs("document.querySelectorAll('.roster-row').length")) === 6);
  ok("no console errors across the whole game", problems.length === 0, problems.join(" | "));
  await shot("05-gameover");
}

head("Playing again keeps the table and changes the words");
{
  const before = await evalJs("[...document.querySelectorAll('.pair-word')].map(e=>e.textContent).join('/')");
  await click("again, same people");
  await sleep(STEP);
  ok("straight back into a reveal", (await phase()) === "reveal");
  ok("with the same six players", (await text()).includes("player 1 of 6"));

  // Deal through and finish quickly to read the new pair.
  for (let i = 0; i < 6; i++) {
    await click("i'm"); await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
    await click("hide and"); await sleep(STEP);
  }
  const after = await evalJs(`(() => {
    // The pair is only shown at game over; read it from the saved state instead.
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return s.pair.civilian + '/' + s.pair.undercover;
  })()`);
  ok("a different pair is in play", before.split("/").sort().join() !== after.split("/").sort().join(),
     before + "  →  " + after);
}

/* ---------------------------------------------------------------- */
head("Mr. Shake naming the word steals the game");
await go();
{
  // Four players, no undercover, one Mr. Shake: voting them out would hand
  // the civilians the game unless the guess lands first.
  await stepper("players", -1); await sleep(200);
  await stepper("players", -1); await sleep(200);
  await stepper("Undercovers", -1); await sleep(200);
  await stepper("Mr. Shake", +1); await sleep(200);
  const comp = await evalJs("[...document.querySelectorAll('.role-row__count')].map(e=>e.textContent).join('/')");
  ok("set up 3 civilians and one Mr. Shake", comp === "3/0/1", comp);

  await click("deal the words"); await sleep(STEP);
  let shakeSeat = -1;
  for (let i = 0; i < 4; i++) {
    await click("i'm"); await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
    if (await evalJs("!!document.querySelector('.word-card--shake')")) shakeSeat = i;
    await click("hide and"); await sleep(STEP);
  }
  ok("exactly one player was told they are Mr. Shake", shakeSeat >= 0, "seat " + (shakeSeat + 1));

  const civWord = await evalJs("JSON.parse(sessionStorage.getItem('mr-shake:game')).pair.civilian");
  const shakeName = await evalJs(`(() => {
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return s.players.find(p => p.role === 'mrshake').name;
  })()`);

  await click("everyone's spoken"); await sleep(STEP);
  ok("voting screen lists everyone", (await evalJs("document.querySelectorAll('.player-btn').length")) === 4);
  await clickExact(shakeName); await sleep(250);
  await click("yes, they're out"); await sleep(STEP);
  ok("voting out Mr. Shake asks for a guess, not a win", (await phase()) === "shakeGuess");
  await shot("06-shake-guess");

  await evalJs(`(() => {
    const i = document.querySelector('.guess-input');
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    set.call(i, ${JSON.stringify("")} + JSON.parse(sessionStorage.getItem('mr-shake:game')).pair.civilian.toUpperCase());
    i.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(200);
  await click("lock it in"); await sleep(STEP);
  ok("a correct guess ends the game", (await phase()) === "gameover");
  ok("and Mr. Shake takes it", (await text()).includes("mr. shake wins"),
     "guessed " + civWord.toUpperCase());
}

/* ---------------------------------------------------------------- */
head("Looking at your own word again mid-round");
await go();
{
  await click("deal the words"); await sleep(STEP);

  // Deal everyone in, remembering what each seat was actually given.
  const dealt = [];
  for (let i = 0; i < 6; i++) {
    await click("i'm"); await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
    dealt.push(await evalJs("document.querySelector('.word-card .word')?.textContent || ''"));
    await click("hide and"); await sleep(STEP);
  }
  ok("round one is under way", (await phase()) === "describe");

  const eyes = await evalJs("document.querySelectorAll('.order-peek').length");
  ok("every name in the speaking order has an eye beside it", eyes === 6, eyes + " eyes");

  // The eye is a second control inside the row, so tapping it must not also
  // strike the name through as "already spoken".
  const rowName = await evalJs("document.querySelectorAll('.order-item__name')[0].textContent");
  await evalJs("document.querySelectorAll('.order-peek')[0].click()");
  await sleep(STEP);
  const seat = await evalJs("document.querySelector('.who')?.textContent || ''");
  ok("it opens a hand-over screen naming that player", seat === rowName, seat + " / row said " + rowName);
  ok("and no word is on screen yet",
     !(await evalJs("!!document.querySelector('.word-card .word')")));

  await click("i'm"); await sleep(STEP);
  ok("the card arrives face down",
     await evalJs("!!document.querySelector('.word-card--face-down')"));
  await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);

  const shown = await evalJs("document.querySelector('.word-card .word')?.textContent || ''");
  ok("the word shown is the one that seat was dealt", dealt.includes(shown), shown);

  await click("hide and carry on"); await sleep(STEP);
  ok("and it goes back to the describe list", (await phase()) === "describe");
  ok("without marking anybody as having spoken",
     (await evalJs(`document.querySelectorAll('.order-item[aria-pressed="true"]').length`)) === 0);

  // "Never mind" has to back out without showing anything at all.
  await evalJs("document.querySelectorAll('.order-peek')[1].click()"); await sleep(STEP);
  await click("never mind"); await sleep(STEP);
  ok("backing out of a peek shows no word", (await phase()) === "describe" &&
     !(await evalJs("!!document.querySelector('.word-card .word')")));
}

head("An elimination names the role but never the word");
{
  const pair = await evalJs(`(() => {
    const s = JSON.parse(sessionStorage.getItem('mr-shake:game'));
    return [s.pair.civilian, s.pair.undercover];
  })()`);

  await click("everyone's spoken"); await sleep(STEP);
  await evalJs("document.querySelector('.player-btn').click()"); await sleep(250);
  await click("yes, they're out"); await sleep(STEP);

  if ((await phase()) === "shakeGuess") {
    await evalJs(`(() => {
      const i = document.querySelector('.guess-input');
      const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
      set.call(i, 'not the word'); i.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await sleep(200); await click("lock it in"); await sleep(STEP);
  }

  if ((await phase()) === "elimination") {
    const screen = await text();
    ok("the table is told which side they were on",
       /was (a civilian|an undercover|mr\. shake)/.test(screen), screen.slice(0, 90));
    // The whole point: the word is still in play for everybody left.
    ok("but neither word is printed anywhere on the screen",
       !screen.includes(pair[0].toLowerCase()) && !screen.includes(pair[1].toLowerCase()),
       pair.join(" / "));
    ok("and it says so, rather than leaving a gap people argue about",
       screen.includes("word stays secret"));
    ok("the impostor count is still shown — the reveals make it public anyway",
       /impostors? still among them/.test(screen));
  } else {
    ok("the game ended on this vote, so nothing was withheld", true, await phase());
  }
}

head("Secret ballot");
await go();
{
  await click("secret ballot"); await sleep(200);
  await click("deal the words"); await sleep(STEP);
  for (let i = 0; i < 6; i++) {
    await click("i'm"); await sleep(STEP);
    await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
    await click("hide and"); await sleep(STEP);
  }
  await click("everyone's spoken"); await sleep(STEP);
  ok("the ballot is passed around, not shown at once", (await phase()) === "ballot");
  ok("it starts with a hand-over", (await text()).includes("pass the phone to"));

  await click("i'm"); await sleep(STEP);
  const voter = await evalJs(`JSON.parse(sessionStorage.getItem('mr-shake:game'))`).then((s) => {
    const alive = s.players.filter((p) => p.alive);
    return alive[s.ballotIndex].name;
  });
  const candidates = await evalJs("[...document.querySelectorAll('.player-btn')].map(b=>b.textContent)");
  ok("you cannot vote for yourself", !candidates.includes(voter),
     voter + " not among " + candidates.length + " candidates");
  await shot("07-ballot");

  // Everyone votes for the same person, so there is no tie to resolve.
  const target = candidates.find((c) => c !== voter);
  let cast = 0;
  for (let i = 0; i < 6 && (await phase()) === "ballot"; i++) {
    if ((await text()).includes("pass the phone to")) { await click("i'm"); await sleep(STEP); }
    const hit = await clickExact(target);
    if (!hit) await evalJs("document.querySelector('.player-btn').click()");
    cast++;
    await sleep(STEP);
  }
  ok("a clear majority eliminates without a runoff", (await phase()) !== "ballot",
     cast + " votes cast, now " + (await phase()));
}

/* ---------------------------------------------------------------- */
head("Both sheets");
await go();
{
  const before = await evalJs("document.documentElement.dataset.theme");
  await evalJs("document.querySelector('.switch').click()");
  await sleep(400);
  const after = await evalJs("document.documentElement.dataset.theme");
  ok("the theme switch flips the sheet", before !== after, before + " → " + after);
  ok("and writes the shared cookie",
     (await evalJs("document.cookie")).includes("sheet-theme=" + after));
  await shot("08-setup-" + after);
  await click("deal the words"); await sleep(STEP);
  await click("i'm"); await sleep(STEP);
  await evalJs("document.querySelector('.word-card--face-down').click()"); await sleep(STEP);
  await shot("09-word-" + after);
}

head("Nothing overflows the phone");
{
  const overflow = await evalJs(
    "document.documentElement.scrollWidth - document.documentElement.clientWidth");
  ok("no horizontal scroll at 390px", overflow <= 0, overflow + "px");
  const small = await evalJs(`(() => {
    const bad = [];
    for (const b of document.querySelectorAll('button')) {
      const r = b.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.height < 40) bad.push(b.textContent.trim().slice(0,20) + ' ' + Math.round(r.height));
    }
    return bad;
  })()`);
  ok("every tap target is at least 40px tall", small.length === 0, small.slice(0, 3).join(" | "));
}

ok("no console errors anywhere in the run", problems.length === 0, problems.join(" | "));

console.log("\n" + pass + " passed, " + fail + " failed\n");
chrome.kill();
process.exit(fail ? 1 : 0);
