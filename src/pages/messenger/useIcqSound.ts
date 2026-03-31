function audioCtx(): AudioContext {
  const Ctx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return new Ctx!();
}

function note(ctx: AudioContext, freq: number, start: number, dur: number, vol = 0.3, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

// ICQ "uh-oh" — входящее сообщение
export function playIcqSound() {
  const ctx = audioCtx();
  note(ctx, 1040, 0.00, 0.12, 0.30);
  note(ctx, 780,  0.13, 0.08, 0.25);
  note(ctx, 520,  0.22, 0.18, 0.40);
}

// Swoosh — отправка сообщения
export function playSwooshSound() {
  const ctx = audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

// Missed call — пропущенный звонок (два коротких бипа)
export function playMissedCallSound() {
  const ctx = audioCtx();
  note(ctx, 880, 0.00, 0.10, 0.20, "sine");
  note(ctx, 880, 0.15, 0.10, 0.20, "sine");
}
