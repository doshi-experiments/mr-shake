import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  CIVILIAN, UNDERCOVER, MRSHAKE, ROLE_LABEL,
  MIN_PLAYERS, MAX_PLAYERS, MIN_PLAYERS_FOR_MRSHAKE,
  initialState, reduce, validateSetup, living, counts, revealFor,
} from "./game.js";
import { packFor } from "./words.js";

/* ------------------------------------------------------------------ *
 *  Theme — the same cookie the portfolio and the experiments index
 *  write, scoped to the registrable domain so a choice made on any one
 *  of the three carries to the others.
 * ------------------------------------------------------------------ */

function readTheme() {
  const m = document.cookie.match(/(?:^|;\s*)sheet-theme=(light|dark)/);
  let t = m && m[1];
  if (!t) { try { t = localStorage.getItem("sheet-theme"); } catch (e) {} }
  if (t !== "light" && t !== "dark")
    t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  return t;
}
function writeTheme(t) {
  try {
    document.cookie = "sheet-theme=" + t + ";domain=.rishabhdoshi.com;path=/;" +
                      "max-age=31536000;samesite=lax";
    document.cookie = "sheet-theme=" + t + ";path=/;max-age=31536000;samesite=lax";
    localStorage.setItem("sheet-theme", t);
  } catch (e) {}
}
function applyTheme(t) {
  const root = document.documentElement;
  root.setAttribute("data-theme", t);
  root.style.colorScheme = t;
  const bg = t === "dark" ? "#0E1C2B" : "#E7E9E3";
  root.style.setProperty("--ms-bg", bg);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", bg);
}

/* ------------------------------------------------------------------ *
 *  Hooks
 * ------------------------------------------------------------------ */

const SAVE_KEY = "mr-shake:game";
const SETUP_KEY = "mr-shake:setup";

/* A game in progress survives a reload, a phone locking, or somebody
 * hitting back. Without this, one accidental swipe ends the evening.
 * sessionStorage rather than localStorage: per tab, and gone when the
 * tab closes, which is the right lifetime for a hand of cards. */
function useGame() {
  const [state, rawDispatch] = useReducer(reduce, undefined, () => {
    const base = initialState();
    // The table is a preference and outlives the tab; the game in progress
    // is a hand of cards and belongs to it. Two stores, two lifetimes.
    try {
      const savedSetup = JSON.parse(localStorage.getItem(SETUP_KEY) || "null");
      if (savedSetup && Array.isArray(savedSetup.names))
        base.setup = { ...base.setup, ...savedSetup };
    } catch (e) {}
    try {
      const saved = sessionStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Guard against a shape from an older build.
        if (parsed && typeof parsed.phase === "string" && parsed.setup) {
          return { ...base, ...parsed };
        }
      }
    } catch (e) {}
    return base;
  });

  useEffect(() => {
    try {
      if (state.phase === "setup") sessionStorage.removeItem(SAVE_KEY);
      else sessionStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // Names, counts, vote mode and pack survive the tab closing, so a group
  // that plays every week types itself in once.
  useEffect(() => {
    try { localStorage.setItem(SETUP_KEY, JSON.stringify(state.setup)); } catch (e) {}
  }, [state.setup]);

  const dispatch = useCallback((action) => rawDispatch(action), []);
  return [state, dispatch];
}

/* Disables a control for a beat after every transition. This is one of
 * the three things stopping a fast double-tap from running two steps of
 * the reveal at once — and the only one that also covers a stray tap
 * carried over from the previous screen. */
function useLockout(deps, ms = 450) {
  const [locked, setLocked] = useState(true);
  const timer = useRef(null);
  useEffect(() => {
    setLocked(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLocked(false), ms);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return locked;
}

/* Keeps the screen awake while a game is running. Progressive: browsers
 * without it simply dim as usual. */
function useWakeLock(active) {
  useEffect(() => {
    if (!active || !navigator.wakeLock) return;
    let sentinel = null, cancelled = false;
    const request = () =>
      navigator.wakeLock.request("screen").then(
        (s) => { if (cancelled) s.release().catch(() => {}); else sentinel = s; },
        () => {}
      );
    request();
    const onVisible = () => { if (document.visibilityState === "visible") request(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (sentinel) sentinel.release().catch(() => {});
    };
  }, [active]);
}

/* ------------------------------------------------------------------ *
 *  Small pieces
 * ------------------------------------------------------------------ */

function Stepper({ label, value, min, max, onChange, suffix }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="stepper">
        <button className="stepper__btn" type="button" aria-label={"Fewer " + label.toLowerCase()}
                disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <span className="stepper__value" aria-live="polite">
          {value}
          {suffix && <small>{suffix}</small>}
        </span>
        <button className="stepper__btn" type="button" aria-label={"More " + label.toLowerCase()}
                disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function RoleRow({ kind, name, note, count, min, max, onChange }) {
  return (
    <div className={"role-row role-row--" + kind}>
      <div>
        <div className="role-row__name">{name}</div>
        <div className="role-row__note">{note}</div>
      </div>
      {onChange ? (
        <div className="stepper" style={{ gap: "0.375rem" }}>
          <button className="stepper__btn" type="button" aria-label={"Fewer " + name}
                  disabled={count <= min} onClick={() => onChange(count - 1)}>−</button>
          <span className="role-row__count">{count}</span>
          <button className="stepper__btn" type="button" aria-label={"More " + name}
                  disabled={count >= max} onClick={() => onChange(count + 1)}>+</button>
        </div>
      ) : (
        <span className="role-row__count">{count}</span>
      )}
    </div>
  );
}

function Chrome({ theme, onToggleTheme, onReset, canReset }) {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const id = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(id);
  }, [confirming]);

  return (
    <header className="chrome">
      <span className="sheet-no">E-04.1 · Mr. Shake</span>
      <span className="chrome-spacer" />
      {canReset && (
        <button
          type="button"
          className={"btn btn--small " + (confirming ? "btn--danger" : "btn--ghost")}
          onClick={() => (confirming ? onReset() : setConfirming(true))}
        >
          {confirming ? "End the game?" : "End game"}
        </button>
      )}
      <button
        type="button"
        className="switch"
        role="switch"
        aria-checked={theme === "light"}
        aria-label={theme === "light" ? "Switch to the dark sheet" : "Switch to the light sheet"}
        onClick={onToggleTheme}
      >
        <span className="switch__track">
          <span className="switch__dot">{theme === "light" ? "☀" : "☾"}</span>
        </span>
      </button>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 *  Setup
 * ------------------------------------------------------------------ */

function Setup({ state, dispatch }) {
  const s = state.setup;
  const errors = validateSetup(s);
  // Chips come from whichever pack is selected; the two have disjoint ids.
  const categories = packFor(s.spicy).categories;
  const impostors = s.undercovers + s.mrShakes;
  const maxImpostors = Math.max(0, Math.ceil(s.players / 2) - 1);

  const patch = (p) => dispatch({ type: "setup/patch", patch: p });

  return (
    <div className="stage stage--scroll stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">A party game for one phone</p>
        <h1 className="title">Everyone gets the same word.<br />Except the ones who don't.</h1>
        <p className="lede">
          Pass the phone round, take your word, then describe it one at a time
          without saying it. Find the impostors before they outnumber you.
        </p>
      </div>

      <Stepper label="Players" value={s.players} min={MIN_PLAYERS} max={MAX_PLAYERS}
               onChange={(v) => patch({ players: v })}
               suffix={s.players + " people, one phone"} />

      <div className="stack--tight stack">
        <span className="label">Who's playing</span>
        <div className="names">
          {s.names.map((n, i) => (
            <label key={i} className="name-field">
              <span className="name-field__n">{i + 1}</span>
              <input
                className="name-input"
                value={n}
                aria-label={"Name of player " + (i + 1)}
                placeholder={"Player " + (i + 1)}
                maxLength={18}
                autoCapitalize="words"
                autoCorrect="off"
                onChange={(e) => dispatch({ type: "setup/name", index: i, name: e.target.value })}
              />
            </label>
          ))}
        </div>
        <p className="fine">
          Blanks stay as Player 1, Player 2 and so on. Names are remembered for
          next time, and anyone can fix theirs when the phone reaches them.
        </p>
      </div>

      <div className="stack--tight stack">
        <span className="label">Who they are</span>
        <div className="roles">
          <RoleRow kind="civilian" name="Civilians" count={s.civilians}
                   note="Get the word. Find everyone who doesn't have it." />
          <RoleRow kind="undercover" name="Undercovers" count={s.undercovers}
                   note="Get a word that is close, but not the same one."
                   min={0} max={Math.max(0, maxImpostors - s.mrShakes)}
                   onChange={(v) => patch({ undercovers: v })} />
          <RoleRow kind="shake" name="Mr. Shake" count={s.mrShakes}
                   note={s.players < MIN_PLAYERS_FOR_MRSHAKE
                     ? "Needs " + MIN_PLAYERS_FOR_MRSHAKE + " players or more."
                     : "Gets no word at all. Bluff, work it out, and name it if caught."}
                   min={0}
                   max={s.players < MIN_PLAYERS_FOR_MRSHAKE ? 0 : Math.max(0, maxImpostors - s.undercovers)}
                   onChange={(v) => patch({ mrShakes: v })} />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="errors" role="alert">
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className="stack--tight stack">
        <span className="label">How you vote</span>
        <div className="segmented">
          <button type="button" className="chip" aria-pressed={s.voteMode === "aloud"}
                  onClick={() => patch({ voteMode: "aloud" })}>
            Out loud
          </button>
          <button type="button" className="chip" aria-pressed={s.voteMode === "ballot"}
                  onClick={() => patch({ voteMode: "ballot" })}>
            Secret ballot
          </button>
        </div>
        <p className="fine">
          {s.voteMode === "aloud"
            ? "Argue it out, then tap whoever the group picked. Fastest, and the part people enjoy."
            : "The phone goes round again each round and everyone votes in private. Slower, but nobody knows who voted for them."}
        </p>
      </div>

      <div className="stack--tight stack">
        <span className="label">Words</span>
        <div className="segmented">
          <button type="button" className="chip" aria-pressed={!s.spicy}
                  onClick={() => dispatch({ type: "setup/setPack", spicy: false })}>
            Clean
          </button>
          <button type="button" className="chip chip--rude" aria-pressed={!!s.spicy}
                  onClick={() => dispatch({ type: "setup/setPack", spicy: true })}>
            Rude
          </button>
        </div>
        <p className="fine">
          {s.spicy
            ? "Dating, hangovers, bad habits and a lot of innuendo. Nothing you couldn't say at a work party, but read the room."
            : "Everyday things — food, animals, places, films. Fine for any table."}
        </p>
      </div>

      <div className="stack--tight stack">
        <span className="label">Narrow it down</span>
        <div className="chips">
          {categories.map((c) => (
            <button key={c.id} type="button" className="chip"
                    aria-pressed={s.categories.includes(c.id)}
                    onClick={() => dispatch({ type: "setup/toggleCategory", id: c.id })}>
              {c.name}
            </button>
          ))}
        </div>
        <p className="fine">
          {s.categories.length ? "Drawing from your picks." : "Nothing picked, so anything can come up."}
        </p>
      </div>

      <button type="button" className="btn btn--primary btn--tall"
              disabled={errors.length > 0}
              onClick={() => dispatch({ type: "game/start" })}>
        Deal the words
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Reveal — the part that has to be airtight
 *
 *  Three stages, not two, and the player index advances on the PASS
 *  step rather than the hide. Combined with the lockout and with the
 *  reveal target sitting in the middle of the screen while the hide
 *  button sits at the bottom, there is no pair of fast taps that skips
 *  anybody or shows one player another player's word.
 * ------------------------------------------------------------------ */

/* The hand-over screen, with an escape hatch for whoever was left as a
 * number. Two constraints, both load-bearing:
 *
 *  1. The rename control sits ABOVE the primary button and is visually
 *     secondary, so it never occupies the primary button's position. The
 *     reveal's whole safety argument rests on adjacent steps not sharing
 *     coordinates.
 *  2. While the input is open the primary button is gone entirely, so a
 *     tap aimed through a phone keyboard cannot advance the reveal with a
 *     half-typed name behind it.
 */
function PassScreen({ player, index, total, locked, onAccept, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(player.name);

  // A new player means a new card; never carry a half-typed name across.
  useEffect(() => { setEditing(false); setDraft(player.name); }, [player.id, player.name]);

  const save = () => {
    if (draft.trim()) onRename(draft);
    setEditing(false);
  };

  return (
    <div className="stage center stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">Player {index + 1} of {total}</p>
        <p className="lede">Pass the phone to</p>
        {editing ? (
          <form className="rename" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <input
              className="rename__input"
              value={draft}
              autoFocus
              aria-label="Your name"
              maxLength={18}
              autoCapitalize="words"
              autoCorrect="off"
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
              Save
            </button>
          </form>
        ) : (
          <p className="who">{player.name}</p>
        )}
      </div>

      {!editing && (
        <>
          <button type="button" className="btn btn--ghost btn--small rename__open"
                  onClick={() => { setDraft(player.name); setEditing(true); }}>
            Not {player.name}?
          </button>
          {/* Centre of the screen — the same place the reveal tap lands, so
              a double tap here only ever gets you to a face-down card. */}
          <button type="button" className="btn btn--primary btn--tall" disabled={locked}
                  onClick={onAccept}>
            I'm {player.name}
          </button>
          <p className="fine">Nobody else should be looking.</p>
        </>
      )}
    </div>
  );
}

function Reveal({ state, dispatch }) {
  const player = state.players[state.revealIndex];
  const stage = state.revealStage;
  const locked = useLockout([state.revealIndex, stage]);
  const card = revealFor(player);
  const total = state.players.length;

  if (stage === "pass") {
    return (
      <PassScreen
        player={player}
        index={state.revealIndex}
        total={total}
        locked={locked}
        onAccept={() => dispatch({ type: "reveal/accept" })}
        onRename={(name) => dispatch({ type: "player/rename", id: player.id, name })}
      />
    );
  }

  if (stage === "hidden") {
    return (
      <div className="stage center stack--loose">
        <p className="eyebrow">{player.name} · card {state.revealIndex + 1} of {total}</p>
        <button type="button"
                className="word-card word-card--face-down"
                disabled={locked}
                onClick={() => dispatch({ type: "reveal/show" })}>
          <span className="lede">Tap to see your word</span>
          <span className="fine">Keep it to yourself</span>
        </button>
      </div>
    );
  }

  // stage === "shown"
  return (
    <div className="stage center stack--loose">
      <p className="eyebrow">{player.name} · card {state.revealIndex + 1} of {total}</p>
      {card.kind === MRSHAKE ? (
        <div className="word-card word-card--shake">
          <span className="word">You're Mr. Shake</span>
          <span className="fine">
            You have no word. Listen to the others, work out what it is, and
            describe it as if you knew all along.
          </span>
        </div>
      ) : (
        <div className="word-card word-card--word">
          <span className="eyebrow">Your word</span>
          <span className="word">{card.word}</span>
        </div>
      )}
      {/* Bottom of the screen, deliberately far from the reveal target. */}
      <button type="button" className="btn" disabled={locked}
              onClick={() => dispatch({ type: "reveal/hide" })}>
        {state.revealIndex + 1 === total ? "Hide and start" : "Hide and pass on"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Describe
 * ------------------------------------------------------------------ */

function Describe({ state, dispatch }) {
  const byId = useMemo(
    () => Object.fromEntries(state.players.map((p) => [p.id, p])), [state.players]);
  const c = counts(state.players);

  return (
    <div className="stage stage--scroll stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">Round {state.round}</p>
        <h2 className="subtitle">Describe your word, one at a time</h2>
        <p className="lede">
          One word or a short phrase each — never the word itself. Tap a name
          once they have gone, so you can pick up where you left off.
        </p>
      </div>

      <ol className="order-list">
        {state.order.map((id, i) => {
          const done = state.spoken.includes(id);
          return (
            <li key={id}>
              <button type="button" className="order-item" aria-pressed={done}
                      onClick={() => dispatch({ type: "describe/toggleSpoken", id })}>
                <span className="order-item__n">{i + 1}</span>
                <span className="order-item__name">{byId[id].name}</span>
                <span className="order-item__tick">{done ? "✓" : ""}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="fine center">
        {c.alive} still in · {c.impostors} {c.impostors === 1 ? "impostor" : "impostors"} among them
      </p>

      <button type="button" className="btn btn--primary btn--tall"
              onClick={() => dispatch({ type: "describe/done" })}>
        Everyone's spoken — vote
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Voting out loud
 * ------------------------------------------------------------------ */

function VoteAloud({ state, dispatch }) {
  const alive = living(state.players);
  const pending = state.pendingVote === null
    ? null
    : state.players.find((p) => p.id === state.pendingVote);

  if (pending) {
    return (
      <div className="stage center stack--loose">
        <p className="eyebrow">Round {state.round}</p>
        <p className="lede">The group votes out</p>
        <p className="who">{pending.name}</p>
        <div className="stack--tight stack">
          <button type="button" className="btn btn--danger btn--tall"
                  onClick={() => dispatch({ type: "vote/confirm" })}>
            Yes, they're out
          </button>
          <button type="button" className="btn btn--ghost"
                  onClick={() => dispatch({ type: "vote/cancel" })}>
            Wait, go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage stage--scroll stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">Round {state.round}</p>
        <h2 className="subtitle">Who's out?</h2>
        <p className="lede">Argue it out, then tap whoever the group picked.</p>
      </div>
      <div className="player-grid">
        {alive.map((p) => (
          <button key={p.id} type="button" className="player-btn"
                  onClick={() => dispatch({ type: "vote/propose", id: p.id })}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Secret ballot
 * ------------------------------------------------------------------ */

function Ballot({ state, dispatch }) {
  const alive = living(state.players);
  const voter = alive[state.ballotIndex];
  const locked = useLockout([state.ballotIndex, state.runoff ? state.runoff.join() : ""]);
  const [handed, setHanded] = useState(false);

  // Reset the hand-over gate whenever the phone moves to a new voter.
  useEffect(() => { setHanded(false); }, [state.ballotIndex, state.runoff]);

  if (!voter) return null;

  const candidates = (state.runoff || alive.map((p) => p.id))
    .filter((id) => id !== voter.id)
    .map((id) => state.players.find((p) => p.id === id));

  if (!handed) {
    return (
      <div className="stage center stack--loose">
        <p className="eyebrow">
          {state.runoff ? "Runoff · " : ""}vote {state.ballotIndex + 1} of {alive.length}
        </p>
        <p className="lede">Pass the phone to</p>
        <p className="who">{voter.name}</p>
        <button type="button" className="btn btn--primary btn--tall" disabled={locked}
                onClick={() => setHanded(true)}>
          I'm {voter.name}
        </button>
      </div>
    );
  }

  return (
    <div className="stage stage--scroll stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">{voter.name} · vote {state.ballotIndex + 1} of {alive.length}</p>
        <h2 className="subtitle">{state.runoff ? "It's a tie. Pick one." : "Who do you think it is?"}</h2>
        <p className="fine">Nobody sees this but you.</p>
      </div>
      <div className="player-grid">
        {candidates.map((p) => (
          <button key={p.id} type="button" className="player-btn"
                  onClick={() => dispatch({ type: "ballot/cast", id: p.id })}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Mr. Shake's last guess
 * ------------------------------------------------------------------ */

function ShakeGuess({ state, dispatch }) {
  const [guess, setGuess] = useState("");
  const victim = state.players.find((p) => p.id === state.lastEliminated);

  return (
    <div className="stage center stack--loose">
      <div className="stack--tight stack">
        <p className="eyebrow">Caught</p>
        <p className="who" style={{ color: "var(--shake)" }}>{victim.name}</p>
        <h2 className="subtitle">was Mr. Shake</h2>
        <p className="lede">
          One guess at the word everybody else had. Get it right and you take
          the game from them.
        </p>
      </div>
      <form
        className="stack"
        onSubmit={(e) => { e.preventDefault(); dispatch({ type: "shake/guess", guess }); }}
      >
        <input className="guess-input" value={guess} autoFocus
               aria-label="Your guess at the civilian word"
               placeholder="the word"
               autoCapitalize="none" autoCorrect="off" spellCheck="false"
               maxLength={40}
               onChange={(e) => setGuess(e.target.value)} />
        <button type="submit" className="btn btn--primary btn--tall" disabled={!guess.trim()}>
          Lock it in
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  What just happened
 * ------------------------------------------------------------------ */

function Elimination({ state, dispatch }) {
  const victim = state.players.find((p) => p.id === state.lastEliminated);
  const c = counts(state.players);
  const shake = state.shakeGuess;

  return (
    <div className="stage center stack--loose">
      {victim ? (
        <div className="stack--tight stack">
          <p className="eyebrow">Round {state.round}</p>
          <p className="who">{victim.name}</p>
          <h2 className="subtitle" style={{ color: roleColor(victim.role) }}>
            was {victim.role === MRSHAKE ? "Mr. Shake"
                 : victim.role === UNDERCOVER ? "an undercover" : "a civilian"}
          </h2>
          {victim.word && (
            <p className="lede">
              Their word was <strong style={{ color: "var(--ink)" }}>{victim.word}</strong>.
            </p>
          )}
          {shake && victim.role === MRSHAKE && (
            <p className="lede">
              They guessed “{shake.guess}” — {shake.correct ? "right" : "wrong"}.
            </p>
          )}
        </div>
      ) : (
        <div className="stack--tight stack">
          <p className="eyebrow">Round {state.round}</p>
          <h2 className="subtitle">Nobody went home</h2>
          <p className="lede">The vote tied twice, so everyone stays in for another round.</p>
        </div>
      )}

      <p className="fine">
        {c.alive} left · {c.impostors} {c.impostors === 1 ? "impostor" : "impostors"} still among them
      </p>

      <button type="button" className="btn btn--primary btn--tall"
              onClick={() => dispatch({ type: "round/next" })}>
        Next round
      </button>
    </div>
  );
}

function roleColor(role) {
  return role === CIVILIAN ? "var(--civilian)"
       : role === UNDERCOVER ? "var(--undercover)"
       : "var(--shake)";
}

/* ------------------------------------------------------------------ *
 *  Game over
 * ------------------------------------------------------------------ */

function GameOver({ state, dispatch }) {
  const headline = state.winner === "civilians" ? "The civilians win"
                 : state.winner === "mrshake" ? "Mr. Shake wins"
                 : "The impostors win";

  return (
    <div className="stage stage--scroll stack--loose">
      <div className={"verdict verdict--" + state.winner}>
        <p className="eyebrow">After {state.round} {state.round === 1 ? "round" : "rounds"}</p>
        <p className="verdict__who">{headline}</p>
        <p className="fine">{state.winNote}</p>
      </div>

      <div className="card">
        <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>The words</p>
        <div className="pair-line">
          <span className="pair-word pair-word--civilian">{state.pair.civilian}</span>
          <span className="fine">against</span>
          <span className="pair-word pair-word--undercover">{state.pair.undercover}</span>
        </div>
      </div>

      <div className="stack--tight stack">
        <span className="label">Everyone</span>
        <div className="roster">
          {state.players.map((p) => (
            <div key={p.id}
                 className={"roster-row roster-row--" + p.role + (p.alive ? "" : " roster-row--out")}>
              <span>{p.name}</span>
              <span className="roster-row__word">{p.word || "no word"}</span>
              <span className="roster-row__role">
                {p.role === MRSHAKE ? "Mr. Shake" : ROLE_LABEL[p.role]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="stack--tight stack">
        <button type="button" className="btn btn--primary btn--tall"
                onClick={() => dispatch({ type: "game/again" })}>
          Again, same people
        </button>
        <button type="button" className="btn btn--ghost"
                onClick={() => dispatch({ type: "game/reset" })}>
          Change the players
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Root
 * ------------------------------------------------------------------ */

export default function App() {
  const [state, dispatch] = useGame();
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);
  useWakeLock(state.phase !== "setup" && state.phase !== "gameover");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    writeTheme(next);
    setTheme(next);
  };

  const screen = () => {
    switch (state.phase) {
      case "reveal": return <Reveal state={state} dispatch={dispatch} />;
      case "describe": return <Describe state={state} dispatch={dispatch} />;
      case "vote": return <VoteAloud state={state} dispatch={dispatch} />;
      case "ballot": return <Ballot state={state} dispatch={dispatch} />;
      case "shakeGuess": return <ShakeGuess state={state} dispatch={dispatch} />;
      case "elimination": return <Elimination state={state} dispatch={dispatch} />;
      case "gameover": return <GameOver state={state} dispatch={dispatch} />;
      default: return <Setup state={state} dispatch={dispatch} />;
    }
  };

  return (
    <div className="app" data-phase={state.phase}>
      <Chrome
        theme={theme}
        onToggleTheme={toggleTheme}
        canReset={state.phase !== "setup"}
        onReset={() => dispatch({ type: "game/reset" })}
      />
      {/* Keyed so React tears the old screen down rather than reusing its
          inputs — a stale guess field carrying into the next round would
          be both confusing and a small leak. */}
      <main className="screen" key={state.phase + ":" + state.revealIndex + ":" + state.round}>
        {screen()}
      </main>
      <footer className="footer">
        <p className="eyebrow center">
          {typeof __APP_VERSION__ !== "undefined" ? "v" + __APP_VERSION__ : "dev"}
          {" · "}rishabhdoshi.com
        </p>
      </footer>
    </div>
  );
}
