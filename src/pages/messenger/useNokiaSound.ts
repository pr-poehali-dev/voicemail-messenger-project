// Nokia Tune Eclipse — синтез через Web Audio API
let stopFn: (() => void) | null = null;

export function playNokiaTune() {
  const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  // Nokia Eclipse notes: E5 D5 F#4 G#4 / A4 G4 B4 C5 / D5 C5 E4 F#4 / B4
  // [freq, startBeat, durationBeats]
  const BPM = 136;
  const beat = 60 / BPM;
  const notes: [number, number, number][] = [
    [659, 0,   0.5],
    [587, 0.5, 0.5],
    [370, 1,   0.5],
    [415, 1.5, 0.5],
    [440, 2,   0.5],
    [392, 2.5, 0.5],
    [494, 3,   0.5],
    [523, 3.5, 0.5],
    [587, 4,   0.5],
    [523, 4.5, 0.5],
    [330, 5,   0.5],
    [370, 5.5, 0.5],
    [494, 6,   1.0],
  ];

  const oscs: OscillatorNode[] = [];

  const playNote = (freq: number, start: number, dur: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur * 0.9);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur);
    oscs.push(osc);
  };

  const totalBeats = 7;
  const loop = () => {
    notes.forEach(([freq, startBeat, durBeats]) => {
      playNote(freq, startBeat * beat, durBeats * beat);
    });
  };

  loop();
  const interval = setInterval(() => {
    if (ctx.state === "closed") { clearInterval(interval); return; }
    loop();
  }, totalBeats * beat * 1000);

  stopFn = () => {
    clearInterval(interval);
    oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
    ctx.close();
    stopFn = null;
  };
}

export function stopNokiaTune() {
  if (stopFn) stopFn();
}
