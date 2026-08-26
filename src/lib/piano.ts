// An original, waltz-lilt piano flourish (not the recording), synthesised with
// Web Audio so there's no audio file to ship or license.

type Note = { f: number; d: number };

const MELODY: Note[] = [
  { f: 659.25, d: 0.34 }, // E5
  { f: 783.99, d: 0.17 }, // G5
  { f: 1046.5, d: 0.17 }, // C6
  { f: 987.77, d: 0.34 }, // B5
  { f: 880.0, d: 0.17 }, // A5
  { f: 783.99, d: 0.17 }, // G5
  { f: 880.0, d: 0.34 }, // A5
  { f: 698.46, d: 0.17 }, // F5
  { f: 880.0, d: 0.17 }, // A5
  { f: 783.99, d: 0.34 }, // G5
  { f: 659.25, d: 0.17 }, // E5
  { f: 523.25, d: 0.17 }, // C5
  { f: 587.33, d: 0.34 }, // D5
  { f: 698.46, d: 0.17 }, // F5
  { f: 659.25, d: 0.17 }, // E5
  { f: 523.25, d: 0.6 }, // C5
];

/** Total playback length in ms (plus a little tail), for syncing UI. */
export const TUNE_MS = MELODY.reduce((t, n) => t + n.d, 0) * 1000 + 400;

function playNote(ctx: AudioContext, freq: number, at: number, dur: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.2, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  gain.connect(ctx.destination);

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

/** Play the flourish once. No-op if Web Audio is unavailable. */
export function playTune() {
  try {
    const ctx = new AudioContext();
    let t = ctx.currentTime + 0.03;
    for (const n of MELODY) {
      playNote(ctx, n.f, t, n.d);
      t += n.d;
    }
    setTimeout(() => void ctx.close(), (t - ctx.currentTime + 0.4) * 1000);
  } catch {
    // no Web Audio support
  }
}
