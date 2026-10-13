// gameOfLife.js
// Conway's Game of Life in chunky neon pixels, with fading trails.
// Used as a "painter" by shaderHub (it keeps its grid between frames).
//
// The board wraps around its edges. When it settles (same population for a
// while) or empties, gliders are dropped in to keep it alive.

// ---------- Tuning ----------
const SIZE = 56;            // cells per side
const STEP_MS = 160;        // time between generations
const TRAIL_MS = 550;       // how long a dead cell keeps glowing
const SEED_DENSITY = 0.14;  // share of living cells at start
const GLIDER_EVERY_MS = 6000;

const BACKGROUND = '#07031a';
const GRID = '#0d0828';

const GLIDERS = [
  [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],   // heading down-right
  [[1, 0], [0, 1], [0, 2], [1, 2], [2, 2]],   // heading down-left
  [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]],   // heading up-right
  [[0, 0], [1, 0], [2, 0], [0, 1], [1, 2]],   // heading up-left
];

export function createGameOfLife() {
  let alive = new Uint8Array(SIZE * SIZE);
  let next = new Uint8Array(SIZE * SIZE);
  const born = new Float64Array(SIZE * SIZE);   // when the cell last came alive
  const died = new Float64Array(SIZE * SIZE).fill(-1e9); // when it last died
  let lastStep = performance.now();
  let lastGlider = performance.now();
  const history = [];

  const idx = (x, y) => ((y + SIZE) % SIZE) * SIZE + ((x + SIZE) % SIZE);

  const seed = (now) => {
    for (let i = 0; i < alive.length; i++) {
      alive[i] = Math.random() < SEED_DENSITY ? 1 : 0;
      if (alive[i]) born[i] = now - Math.random() * 3000;
    }
  };

  const dropGlider = (now) => {
    const shape = GLIDERS[Math.floor(Math.random() * GLIDERS.length)];
    const ox = Math.floor(Math.random() * SIZE);
    const oy = Math.floor(Math.random() * SIZE);
    shape.forEach(([x, y]) => {
      const i = idx(ox + x, oy + y);
      if (!alive[i]) born[i] = now;
      alive[i] = 1;
    });
  };

  const step = (now) => {
    let population = 0;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx || dy) n += alive[idx(x + dx, y + dy)];
          }
        }
        const i = y * SIZE + x;
        const live = alive[i] ? n === 2 || n === 3 : n === 3;
        next[i] = live ? 1 : 0;
        if (live && !alive[i]) born[i] = now;
        if (!live && alive[i]) died[i] = now;
        population += next[i];
      }
    }
    [alive, next] = [next, alive];

    // Settled or empty: bring in fresh gliders (or reseed if almost nothing is left)
    history.push(population);
    if (history.length > 30) history.shift();
    const stale = history.length === 30 && history.every((p) => p === history[0]);
    if (population < SIZE * SIZE * 0.01) seed(now);
    else if (stale) for (let k = 0; k < 2; k++) dropGlider(now);
  };

  seed(performance.now());

  return {
    paint(ctx, w, h) {
      const now = performance.now();
      // Catch up on missed generations, but never more than a few at once
      let steps = 0;
      while (now - lastStep >= STEP_MS && steps < 3) {
        step(now);
        lastStep += STEP_MS;
        steps++;
      }
      if (now - lastStep > STEP_MS * 3) lastStep = now;
      if (now - lastGlider > GLIDER_EVERY_MS) {
        dropGlider(now);
        lastGlider = now;
      }

      const cell = w / SIZE;
      const cellH = h / SIZE;
      const gap = Math.max(1, Math.floor(cell * 0.12));
      ctx.fillStyle = GRID;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = BACKGROUND;
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          ctx.fillRect(Math.floor(x * cell), Math.floor(y * cellH), Math.ceil(cell) - gap, Math.ceil(cellH) - gap);
        }
      }

      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const i = y * SIZE + x;
          let color = null;
          if (alive[i]) {
            // Newborn cells are pink, long-lived ones turn cyan
            const age = Math.min(1, (now - born[i]) / 2500);
            const r = Math.round(255 - 175 * age);
            const g = Math.round(80 + 160 * age);
            const b = Math.round(216 + 39 * age);
            color = `rgb(${r},${g},${b})`;
          } else {
            const fade = 1 - (now - died[i]) / TRAIL_MS;
            if (fade > 0) color = `rgba(150,60,255,${(fade * 0.55).toFixed(3)})`;
          }
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x * cell), Math.floor(y * cellH), Math.ceil(cell) - gap, Math.ceil(cellH) - gap);
          }
        }
      }
    },
  };
}
