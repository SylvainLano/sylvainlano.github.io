// snake.js
// A Snake that plays by itself, in neon pixels — a nod to Hexagonal Snake.
// Used as a "painter" by shaderHub (it keeps its game state between frames).
//
// It plays in the band left visible around the card (BAND cells wide), not
// under it. Each move, the snake takes the shortest safe path to the food
// (breadth-first search). With no path, it heads where it has the most room
// left; when it is stuck or the band gets too full, the game starts over.

// ---------- Tuning ----------
const SIZE = 26;          // cells per side
const BAND = 3;           // width of the playable band around the card, in cells
const STEP_MS = 75;       // time between moves
const RESTART_MS = 900;   // pause before a new game
const MAX_FILL = 0.35;    // start over once the snake covers this share of the band

const BACKGROUND = '#06041a';
const GRID = '#0c0930';
const FOOD = [255, 70, 170];
const HEAD = [120, 255, 190];
const TAIL = [70, 40, 170];

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function createSnake() {
  let snake;         // array of [x, y], head first
  let food;
  let lastStep = performance.now();
  let deadUntil = 0;

  const key = (x, y) => y * SIZE + x;
  const onBoard = (x, y) => x >= 0 && y >= 0 && x < SIZE && y < SIZE;
  const inBand = (x, y) => x < BAND || y < BAND || x >= SIZE - BAND || y >= SIZE - BAND;
  const inside = (x, y) => onBoard(x, y) && inBand(x, y);
  const bandCells = SIZE * SIZE - (SIZE - 2 * BAND) * (SIZE - 2 * BAND);

  const placeFood = () => {
    const taken = new Set(snake.map(([x, y]) => key(x, y)));
    const free = [];
    for (let i = 0; i < SIZE * SIZE; i++) {
      if (!taken.has(i) && inBand(i % SIZE, Math.floor(i / SIZE))) free.push(i);
    }
    const pick = free[Math.floor(Math.random() * free.length)];
    food = [pick % SIZE, Math.floor(pick / SIZE)];
  };

  const reset = () => {
    const y = Math.floor(BAND / 2);
    snake = [[6, y], [5, y], [4, y]];
    placeFood();
  };

  // Cells the snake cannot enter next move (its tail will have moved away)
  const blocked = () => new Set(snake.slice(0, -1).map(([x, y]) => key(x, y)));

  const firstStepTowardFood = () => {
    const block = blocked();
    const [hx, hy] = snake[0];
    const from = new Map([[key(hx, hy), null]]);
    const queue = [[hx, hy]];
    while (queue.length) {
      const [x, y] = queue.shift();
      if (x === food[0] && y === food[1]) {
        // Walk back to the move right after the head
        let k = key(x, y);
        let prev = from.get(k);
        while (prev !== null && prev !== key(hx, hy)) {
          k = prev;
          prev = from.get(k);
        }
        return [k % SIZE, Math.floor(k / SIZE)];
      }
      for (const [dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        const nk = key(nx, ny);
        if (inside(nx, ny) && !block.has(nk) && !from.has(nk)) {
          from.set(nk, key(x, y));
          queue.push([nx, ny]);
        }
      }
    }
    return null;
  };

  const roomFrom = (sx, sy, block) => {
    const seen = new Set([key(sx, sy)]);
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      for (const [dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        const nk = key(nx, ny);
        if (inside(nx, ny) && !block.has(nk) && !seen.has(nk)) {
          seen.add(nk);
          stack.push([nx, ny]);
        }
      }
    }
    return seen.size;
  };

  const roomiestStep = () => {
    const block = blocked();
    const [hx, hy] = snake[0];
    let best = null;
    let bestRoom = 0;
    DIRS.forEach(([dx, dy]) => {
      const nx = hx + dx;
      const ny = hy + dy;
      if (!inside(nx, ny) || block.has(key(nx, ny))) return;
      const room = roomFrom(nx, ny, block);
      if (room > bestRoom) {
        bestRoom = room;
        best = [nx, ny];
      }
    });
    return best;
  };

  const step = (now) => {
    let next = firstStepTowardFood();
    // Don't follow a path into a pocket smaller than the snake itself
    if (next && roomFrom(next[0], next[1], blocked()) < snake.length) next = roomiestStep();
    if (!next) next = roomiestStep();
    if (!next) {
      deadUntil = now + RESTART_MS;
      return;
    }
    snake.unshift(next);
    if (next[0] === food[0] && next[1] === food[1]) {
      if (snake.length > bandCells * MAX_FILL) {
        deadUntil = now + RESTART_MS;
        return;
      }
      placeFood();
    } else {
      snake.pop();
    }
  };

  reset();

  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  return {
    paint(ctx, w, h) {
      const now = performance.now();
      if (deadUntil) {
        if (now >= deadUntil) {
          deadUntil = 0;
          reset();
          lastStep = now;
        }
      } else {
        let steps = 0;
        while (now - lastStep >= STEP_MS && steps < 3 && !deadUntil) {
          step(now);
          lastStep += STEP_MS;
          steps++;
        }
        if (now - lastStep > STEP_MS * 3) lastStep = now;
      }

      const cw = w / SIZE;
      const ch = h / SIZE;
      const gap = Math.max(1, Math.floor(cw * 0.14));
      const cell = (x, y) => [Math.floor(x * cw) + gap, Math.floor(y * ch) + gap, Math.ceil(cw) - gap * 2, Math.ceil(ch) - gap * 2];

      ctx.fillStyle = GRID;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = BACKGROUND;
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          if (!inBand(x, y)) continue;
          ctx.fillRect(Math.floor(x * cw) + 1, Math.floor(y * ch) + 1, Math.ceil(cw) - 2, Math.ceil(ch) - 2);
        }
      }
      // The middle (under the card) is plain
      ctx.fillRect(Math.floor(BAND * cw), Math.floor(BAND * ch), Math.ceil((SIZE - 2 * BAND) * cw), Math.ceil((SIZE - 2 * BAND) * ch));

      // Food, pulsing
      const pulse = 0.75 + 0.25 * Math.sin(now / 160);
      ctx.fillStyle = `rgb(${FOOD.map((v) => Math.round(v * pulse)).join(',')})`;
      ctx.fillRect(...cell(food[0], food[1]));

      // Snake: bright head fading to a deep tail; it flashes before a restart
      const flashing = deadUntil && Math.floor(now / 120) % 2 === 0;
      snake.forEach(([x, y], i) => {
        const t = snake.length > 1 ? i / (snake.length - 1) : 0;
        const [r, g, b] = flashing ? [255, 255, 255] : mix(HEAD, TAIL, t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(...cell(x, y));
      });
    },
  };
}
