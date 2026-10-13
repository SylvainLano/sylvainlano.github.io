import React, { useEffect, useRef } from 'react';
import './App.css';
import BackgroundText from './components/BackgroundText';
import Cube from './components/Cube';

// ---------- Mobile background rhythm (desktop follows the mouse, as before) ----------
// The background refreshes once every 6 calls to nextStep(), so these are the
// delays between two *refreshes*; each one is split into 6 calls.
const MOBILE_SLOW_MS = 1800;     // delay during the long slow phase
const MOBILE_FAST_MS = 90;       // shortest delay, at the peak of a wave
const MOBILE_CYCLE_S = 16;       // length of one wave cycle
const MOBILE_BURST_SHARE = 0.18; // part of the cycle spent accelerating then slowing
const CALLS_PER_REFRESH = 6;

// Long slow phases broken by a short wave (a sine bump): faster, then slower again
function mobileRefreshDelay(seconds) {
  const phase = (seconds % MOBILE_CYCLE_S) / MOBILE_CYCLE_S;
  if (phase >= MOBILE_BURST_SHARE) return MOBILE_SLOW_MS;
  const bump = Math.sin(Math.PI * (phase / MOBILE_BURST_SHARE)); // 0 → 1 → 0
  return MOBILE_SLOW_MS - (MOBILE_SLOW_MS - MOBILE_FAST_MS) * bump * bump;
}

function App() {
  const backgroundTextRef = useRef(null);

  // Desktop: the background text moves when the mouse moves (original behaviour)
  const handleMouseMove = () => {
    if (backgroundTextRef.current) {
      backgroundTextRef.current.nextStep();
    }
  };

  // Mobile (no mouse): a timer drives the background in waves
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!coarse || reduceMotion) return undefined;
    const start = performance.now();
    let timer;
    const tick = () => {
      if (backgroundTextRef.current) backgroundTextRef.current.nextStep();
      const delay = mobileRefreshDelay((performance.now() - start) / 1000) / CALLS_PER_REFRESH;
      timer = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <BackgroundText ref={backgroundTextRef} />
      <Cube />
    </div>
  );
}

export default App;
