/**
 * Web Audio tune player.
 *
 * The music now lives in two notation strings instead of a hard-coded
 * frequency table, so a different tune can be dropped in without touching
 * the synth code below.
 *
 *   Melody syntax:   <note>:<beats>          e.g. "E5:1"  "Bb4:0.5"  "r:2" (rest)
 *   Voicing syntax:  <n>+<n>+<n>:<beats>     e.g. "C#4+E4+A4:4"  (keeps inversions)
 *   Chord syntax:    <chord>:<beats>         e.g. "Dm:3"  "F7:1.5" (root position)
 *
 * Beats are relative to TEMPO_BPM. In 3/4, one bar = 3 beats, so a waltz bar
 * of Dm is written "Dm:3". The two timelines run independently; they just
 * both start at t=0, so the melody doesn't have to line up bar-for-bar.
 */

export const TEMPO_BPM = 88;
const BEAT = 60 / TEMPO_BPM;

/** Set to 0 to mute the left-hand accompaniment. */
const CHORD_VOLUME = 0.09;
const MELODY_VOLUME = 0.2;

// ---------------------------------------------------------------------------
// The music
// ---------------------------------------------------------------------------

/** Right hand. */
const MELODY = `
  C4:0.5 A4:0.5 G4:0.25 A4:0.5 G4:0.5 Bb4:0.5 A4:0.75 r:0.5
  F4:0.25 G4:0.25 A4:0.5 G4:0.25 A4:0.5 G4:0.5 Bb4:0.5 A4:0.75 r:0.5
  F4:0.25 G4:0.25 A4:0.5 G4:0.25 A4:0.5 G4:0.5 Bb4:0.5 A4:0.75 r:0.5
`;

/**
 * Left hand, as explicit stacked voicings: notes low-to-high joined by "+",
 * each with its own octave, so inversions survive. Leave empty ("") for
 * melody only.
 *
 * (Chord symbols like "Dm:3" also work; see LEFT_HAND_IS_SYMBOLS below.)
 */
const LEFT_HAND = `
  C#4+E4+A4:4  D4+F4+A4:4  C#4+E4+A4:4
`;

/** Set true if LEFT_HAND uses chord symbols ("Dm:3") instead of "+" stacks. */
const LEFT_HAND_IS_SYMBOLS = false;

/** Set true for a 3/4 oom-pah-pah bass instead of sustained chords. */
const LEFT_HAND_WALTZ = false;

/**
 * Where each hand enters, in beats. Use these when the hands don't start
 * together, e.g. a melody pickup (anacrusis) ahead of the first full bar:
 * leave the melody at 0 and set the left hand to the pickup's length.
 * Negative values are allowed; the whole score is shifted so nothing is cut.
 */
const MELODY_START_BEAT = 0;
const LEFT_HAND_START_BEAT = 0.5;

// ---------------------------------------------------------------------------
// Notation parsing
// ---------------------------------------------------------------------------

const SEMITONE: Readonly<Record<string, number>> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const CHORD_SHAPES: Readonly<Record<string, readonly number[]>> = {
  "": [0, 4, 7], // major
  m: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  "6": [0, 4, 7, 9],
  "7": [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  m6: [0, 3, 7, 9],
};

const NOTE_RE = /^([A-Ga-g])([#b]?)(-?\d)$/;
const CHORD_RE = /^([A-Ga-g])([#b]?)(.*)$/;

function midiOf(letter: string, accidental: string, octave: number): number {
  const base = SEMITONE[letter.toUpperCase()];
  if (base === undefined) throw new Error(`unknown note letter: ${letter}`);
  const shift = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  return (octave + 1) * 12 + base + shift;
}

const freqOfMidi = (midi: number): number =>
  440 * Math.pow(2, (midi - 69) / 12);

type Step = { freqs: number[]; beats: number };

/** "E5:0.5" -> one pitch. "r:1" / "-:1" -> a rest. */
function parseMelody(source: string): Step[] {
  return tokenize(source).map(({ symbol, beats }) => {
    if (symbol === "r" || symbol === "-") return { freqs: [], beats };
    const m = NOTE_RE.exec(symbol);
    if (!m) throw new Error(`bad note: "${symbol}"`);
    return {
      freqs: [freqOfMidi(midiOf(m[1]!, m[2]!, Number(m[3])))],
      beats,
    };
  });
}

/** "Dm:3" -> a triad voiced in the octave below middle C. */
function parseChords(source: string, octave = 3): Step[] {
  return tokenize(source).map(({ symbol, beats }) => {
    if (symbol === "r" || symbol === "-") return { freqs: [], beats };
    const m = CHORD_RE.exec(symbol);
    if (!m) throw new Error(`bad chord: "${symbol}"`);
    const shape = CHORD_SHAPES[m[3]!];
    if (!shape) throw new Error(`unknown chord quality: "${m[3]}"`);
    const root = midiOf(m[1]!, m[2]!, octave);
    return { freqs: shape.map((i) => freqOfMidi(root + i)), beats };
  });
}

/** "C#4+E4+A4:4" -> an explicit stack, voiced exactly as written. */
function parseVoicing(source: string): Step[] {
  return tokenize(source).map(({ symbol, beats }) => {
    if (symbol === "r" || symbol === "-") return { freqs: [], beats };
    return {
      freqs: symbol.split("+").map((name) => {
        const m = NOTE_RE.exec(name);
        if (!m) throw new Error(`bad note in voicing: "${name}"`);
        return freqOfMidi(midiOf(m[1]!, m[2]!, Number(m[3])));
      }),
      beats,
    };
  });
}

function tokenize(source: string): { symbol: string; beats: number }[] {
  return source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const at = token.lastIndexOf(":");
      if (at < 1) throw new Error(`missing duration in "${token}"`);
      const beats = Number(token.slice(at + 1));
      if (!Number.isFinite(beats) || beats <= 0)
        throw new Error(`bad duration in "${token}"`);
      return { symbol: token.slice(0, at), beats };
    });
}

// ---------------------------------------------------------------------------
// Scheduling
// ---------------------------------------------------------------------------

type Voice = { freqs: number[]; start: number; dur: number; gain: number };

function layToVoices(
  steps: Step[],
  gain: number,
  legato = 0.9,
  startBeat = 0,
): Voice[] {
  const voices: Voice[] = [];
  let t = startBeat * BEAT;
  for (const step of steps) {
    const span = step.beats * BEAT;
    if (step.freqs.length > 0)
      voices.push({ freqs: step.freqs, start: t, dur: span * legato, gain });
    t += span;
  }
  return voices;
}

/**
 * Turns sustained chords into a 3/4 oom-pah-pah: root on the downbeat, then
 * the upper voices on the offbeats. Non-waltz material passes through as a
 * plain sustained chord.
 */
function waltzify(steps: Step[], gain: number, startBeat = 0): Voice[] {
  const voices: Voice[] = [];
  let t = startBeat * BEAT;
  for (const step of steps) {
    const whole = Math.round(step.beats);
    const isWaltzBar = whole >= 2 && Math.abs(step.beats - whole) < 1e-6;
    if (step.freqs.length === 0 || !isWaltzBar) {
      if (step.freqs.length > 0)
        voices.push({
          freqs: step.freqs,
          start: t,
          dur: step.beats * BEAT * 0.9,
          gain,
        });
    } else {
      for (let b = 0; b < whole; b++) {
        const isDownbeat = b === 0;
        voices.push({
          freqs: isDownbeat ? [step.freqs[0]! / 2] : step.freqs.slice(1),
          start: t + b * BEAT,
          dur: BEAT * (isDownbeat ? 0.85 : 0.5),
          gain: isDownbeat ? gain * 1.3 : gain,
        });
      }
    }
    t += step.beats * BEAT;
  }
  return voices;
}

const leftHandSteps: Step[] = LEFT_HAND.trim()
  ? LEFT_HAND_IS_SYMBOLS
    ? parseChords(LEFT_HAND)
    : parseVoicing(LEFT_HAND)
  : [];

const rawScore: Voice[] = [
  ...layToVoices(parseMelody(MELODY), MELODY_VOLUME, 0.9, MELODY_START_BEAT),
  ...(LEFT_HAND_WALTZ
    ? waltzify(leftHandSteps, CHORD_VOLUME, LEFT_HAND_START_BEAT)
    : layToVoices(leftHandSteps, CHORD_VOLUME, 0.98, LEFT_HAND_START_BEAT)),
];

// A negative start beat would schedule before t=0, which Web Audio clamps
// (and would bunch those notes together). Shift everything instead.
const earliest = rawScore.reduce((min, v) => Math.min(min, v.start), 0);
const SCORE: Voice[] = rawScore.map((v) => ({
  ...v,
  start: v.start - earliest,
}));

/** Beats per timeline, exported so a test can assert the bars line up. */
export const BEAT_TOTALS = {
  melody: parseMelody(MELODY).reduce((n, s) => n + s.beats, 0),
  leftHand: leftHandSteps.reduce((n, s) => n + s.beats, 0),
};

/** Total playback length in ms (plus a little tail), for syncing UI. */
export const TUNE_MS =
  SCORE.reduce((end, v) => Math.max(end, v.start + v.dur), 0) * 1000 + 400;

// ---------------------------------------------------------------------------
// Synth
// ---------------------------------------------------------------------------

function playNote(
  ctx: AudioContext,
  out: AudioNode,
  freq: number,
  at: number,
  dur: number,
  peak: number,
) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(peak * 0.4, at + Math.min(0.18, dur));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  gain.connect(out);

  // triangle body + a soft sub-octave sine for warmth
  const tone = ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.value = freq;
  tone.connect(gain);
  tone.start(at);
  tone.stop(at + dur + 0.05);

  const sub = ctx.createGain();
  sub.gain.value = 0.5;
  sub.connect(gain);
  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.value = freq / 2;
  body.connect(sub);
  body.start(at);
  body.stop(at + dur + 0.05);
}

/** Play the tune once. No-op if Web Audio is unavailable. */
export function playTune() {
  try {
    const ctx = new AudioContext();

    // one shared limiter-ish master so stacked chord tones don't clip
    const master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);

    const t0 = ctx.currentTime + 0.03;
    let end = t0;
    for (const voice of SCORE) {
      const at = t0 + voice.start;
      const per = voice.gain / Math.max(1, Math.sqrt(voice.freqs.length));
      for (const f of voice.freqs) playNote(ctx, master, f, at, voice.dur, per);
      end = Math.max(end, at + voice.dur);
    }

    setTimeout(() => void ctx.close(), (end - ctx.currentTime + 0.4) * 1000);
  } catch {
    // no Web Audio support
  }
}
