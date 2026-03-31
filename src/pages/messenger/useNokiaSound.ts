// Nokia Tune — синтез через Web Audio API с корректным зацикливанием
let stopFn: (() => void) | null = null;

export function playNokiaTune() {
  if (stopFn) stopNokiaTune();

  const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

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

  const loopDuration = 7 * beat;
  let stopped = false;
  const allOscs: OscillatorNode[] = [];

  const scheduleLoop = (startTime: number) => {
    if (stopped) return;
    notes.forEach(([freq, startBeat, durBeats]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      const t = startTime + startBeat * beat;
      const d = durBeats * beat;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d * 0.9);
      osc.start(t);
      osc.stop(t + d);
      allOscs.push(osc);
    });

    const nextStart = startTime + loopDuration;
    const delay = (nextStart - ctx.currentTime) * 1000 - 100;
    setTimeout(() => {
      if (!stopped) scheduleLoop(nextStart);
    }, Math.max(0, delay));
  };

  scheduleLoop(ctx.currentTime);

  stopFn = () => {
    stopped = true;
    allOscs.forEach(o => {
      try {
        o.stop();
      } catch {
        // уже остановлен
      }
    });
    setTimeout(() => {
      try { ctx.close(); } catch { /* ignore */ }
    }, 200);
    stopFn = null;
  };
}

export function stopNokiaTune() {
  if (stopFn) stopFn();
}
