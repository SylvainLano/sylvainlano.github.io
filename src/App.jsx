import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import BackgroundText from './components/BackgroundText';
import Cube from './components/Cube';
import Reader, { firstItem } from './components/Reader';
import Coasters from './components/Coasters';
import { collections } from './data/texts';

// The reader has its own address, #/read/<collection>/<text>, so a text can be shared
function readingFromHash() {
  const m = window.location.hash.match(/^#\/read\/([\w-]+)(?:\/([\w-]+))?/);
  if (!m || !collections[m[1]]) return null;
  return { coll: m[1], id: m[2] || firstItem(m[1]) };
}
const hashFor = (r) => `#/read/${r.coll}/${r.id}`;
// The full coaster ranking has its own address too
const COASTERS_HASH = '#/coasters';
const coastersFromHash = () => window.location.hash === COASTERS_HASH;

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
  const [reading, setReading] = useState(readingFromHash);
  const [coasters, setCoasters] = useState(coastersFromHash);
  const [side, setSide] = useState('work'); // which side of the cube is shown: the background follows
  const pushed = useRef(false); // did we add the history entry we are on?

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      setReading(readingFromHash());
      setCoasters(coastersFromHash());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openReader = useCallback((coll, id) => {
    const next = { coll, id: id || firstItem(coll) };
    window.history.pushState(null, '', hashFor(next));
    pushed.current = true;
    setReading(next);
  }, []);
  // Turning pages replaces the address, so the Back button leaves the reader
  const turnPage = useCallback((id) => {
    setReading((r) => {
      const next = { ...r, id };
      window.history.replaceState(null, '', hashFor(next));
      return next;
    });
  }, []);
  // Closing an overlay goes back if we opened it, else just clears the address
  const closeOverlay = useCallback(() => {
    if (pushed.current) {
      window.history.back(); // popstate clears the overlay
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setReading(null);
      setCoasters(false);
    }
  }, []);

  const openCoasters = useCallback(() => {
    window.history.pushState(null, '', COASTERS_HASH);
    pushed.current = true;
    setCoasters(true);
  }, []);

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
      <BackgroundText ref={backgroundTextRef} side={side} />
      <Cube reading={!!reading || coasters} onRead={openReader} onCoasters={openCoasters} onSideChange={setSide} />
      {reading && (
        <Reader
          key={reading.coll}
          collKey={reading.coll}
          itemId={reading.id}
          onNavigate={turnPage}
          onClose={closeOverlay}
        />
      )}
      {coasters && <Coasters onClose={closeOverlay} />}
    </div>
  );
}

export default App;
