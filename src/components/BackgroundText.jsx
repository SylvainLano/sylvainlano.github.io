// BackgroundText.jsx
// The wall of random characters behind the cube. Every few steps it is redrawn,
// and words from src/data/backgroundWords.js surface in it one by one, each kind
// in its own colour. The words follow the side of the cube being shown.
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { backgroundWords, wordClasses } from '../data/backgroundWords';
import './BackgroundText.css';

// ---------- Tuning ----------
const STEPS_PER_REFRESH = 5;      // calls to nextStep() between two redraws
const REFRESHES_PER_WORD = 6;     // a new word surfaces every this many redraws
const CHARS_PER_WORD = 45;        // at most one word per this many characters on screen
const CHAR_W = 19;                // 32px Courier: about 19px wide…
const CHAR_H = 36;                // …and 36px tall
const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const BackgroundText = forwardRef(({ showInfo, side = 'work' }, ref) => {
  const [html, setHtml] = useState('');
  const steps = useRef(0);
  const refreshes = useRef(0);
  const words = useRef([]);        // { text, start, kind } on the current wall
  const bags = useRef({});         // kind -> words not shown yet, shuffled
  const turn = useRef(0);          // which kind comes next
  const sideRef = useRef(side);

  // A new side of the cube: its own words, starting from a clean wall
  useEffect(() => {
    sideRef.current = side;
    words.current = [];
    bags.current = {};
    turn.current = 0;
  }, [side]);

  // Draw a word without repeating one until all of its kind have been shown
  const drawWord = (kind) => {
    const pool = backgroundWords[sideRef.current][kind];
    if (!bags.current[kind] || bags.current[kind].length === 0) {
      const onWall = new Set(words.current.map((w) => w.text));
      bags.current[kind] = shuffle(pool.filter((w) => !onWall.has(w)));
      if (bags.current[kind].length === 0) return null;
    }
    return bags.current[kind].pop();
  };

  // A free stretch for a word, with a little room around the others
  const findSpot = (length, total) => {
    for (let tries = 0; tries < 40; tries++) {
      const start = Math.floor(Math.random() * Math.max(1, total - length));
      const clear = words.current.every((w) => start + length + 2 < w.start || start > w.start + w.text.length + 2);
      if (clear) return start;
    }
    return -1;
  };

  const addWord = (total) => {
    if (words.current.length >= Math.floor(total / CHARS_PER_WORD)) return;
    const kinds = Object.keys(backgroundWords[sideRef.current]);
    const kind = kinds[turn.current % kinds.length];
    turn.current += 1;
    const text = drawWord(kind);
    if (!text) return;
    const start = findSpot(text.length, total);
    if (start >= 0) words.current = [...words.current, { text, start, kind }];
  };

  const redraw = () => {
    const columns = Math.ceil((window.innerWidth + 10) / CHAR_W) + 2;
    const rows = Math.ceil((window.innerHeight + 30) / CHAR_H) + 2;
    const total = columns * rows;
    // A smaller window may have pushed some words off the wall
    words.current = words.current.filter((w) => w.start + w.text.length <= total);
    refreshes.current += 1;
    if (refreshes.current % REFRESHES_PER_WORD === 0) addWord(total);

    const placed = [...words.current].sort((a, b) => a.start - b.start);
    let out = '';
    let at = 0;
    const noise = (n) => {
      let s = '';
      for (let i = 0; i < n; i++) s += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
      return s;
    };
    placed.forEach((w) => {
      out += noise(w.start - at);
      out += `<span class="bg-word ${wordClasses[w.kind]}">${escapeHtml(w.text).replace(/ /g, '&nbsp;')}</span>`;
      at = w.start + w.text.length;
    });
    out += noise(total - at);
    setHtml(out);
  };

  useImperativeHandle(ref, () => ({
    nextStep: () => {
      steps.current += 1;
      if (steps.current > STEPS_PER_REFRESH) {
        steps.current = 0;
        redraw();
      }
    },
  }));

  return (
    <div
      className={`background-text ${showInfo ? 'blur-background' : ''}`}
      style={{ zIndex: -1, width: `${window.innerWidth + 10}px`, height: `${window.innerHeight + 30}px` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export default BackgroundText;
