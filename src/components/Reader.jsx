// The reader: a full-screen reading view laid over the cube.
// It opens one text of a collection (src/data/texts.js), fetches its markdown
// from public/texts/<collection>/<id>.md, and lets the visitor pick a paper,
// a typeface and a size. Those settings are remembered per collection.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collections } from '../data/texts';
import { renderMarkdown } from './markdown';
import './Reader.css';

const THEMES = [
  { id: 'paper', label: 'Paper' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'night', label: 'Night' },
];
const FONTS = [
  { id: 'serif', label: 'Garamond' },
  { id: 'sans', label: 'Sans' },
  { id: 'mono', label: 'Typewriter' },
];
const SIZES = [16, 18, 20, 22, 25]; // px
const DEFAULT_SIZE = 2;

const cache = new Map();

function loadSettings(collKey) {
  const c = collections[collKey];
  const fallback = { theme: c.theme, font: c.font, size: DEFAULT_SIZE };
  try {
    const saved = JSON.parse(window.localStorage.getItem(`reader:${collKey}`) || 'null');
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
}

function saveSettings(collKey, settings) {
  try {
    window.localStorage.setItem(`reader:${collKey}`, JSON.stringify(settings));
  } catch {
    /* private mode or blocked storage: settings simply last for this visit */
  }
}

// Contents as folders: group > series > texts. Untitled sections put their
// texts straight in the parent folder; a lone untitled section is just a list.
function buildTree(coll) {
  const root = { key: '', label: coll.title, children: [] };
  const groups = new Map();
  const leaves = (items) => items.map((it) => ({ type: 'item', ...it }));
  coll.sections.forEach((s, si) => {
    let parent = root;
    if (s.group) {
      if (!groups.has(s.group)) {
        const g = { type: 'folder', key: `g:${s.group}`, label: s.group, children: [] };
        groups.set(s.group, g);
        root.children.push(g);
      }
      parent = groups.get(s.group);
    }
    if (s.title) parent.children.push({ type: 'folder', key: `s:${si}`, label: s.title, children: leaves(s.items) });
    else parent.children.push(...leaves(s.items));
  });
  const count = (n) => (n.type === 'item' ? 1 : n.children.reduce((a, c) => a + count(c), 0));
  const index = new Map(); // folder key -> folder, item id -> folder path
  const walk = (n, path) =>
    n.children.forEach((c) => {
      if (c.type === 'folder') {
        c.count = count(c);
        index.set(c.key, c);
        walk(c, [...path, c.key]);
      } else index.set(`i:${c.id}`, path);
    });
  walk(root, []);
  return { root, index };
}

function Contents({ coll, currentId, onPick }) {
  const { root, index } = useMemo(() => buildTree(coll), [coll]);
  // Open on the folder that holds the text being read
  const [path, setPath] = useState(() => index.get(`i:${currentId}`) || []);
  const listRef = useRef(null);
  const folder = path.length ? index.get(path[path.length - 1]) : root;
  const parent = path.length > 1 ? index.get(path[path.length - 2]) : root;

  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('.is-current');
    if (el) el.scrollIntoView({ block: 'center' });
    else if (listRef.current) listRef.current.scrollTop = 0;
  }, [path]);

  return (
    <nav className="reader__panel reader__panel--contents" aria-label="Contents">
      <div className="reader__toc-head">
        {path.length > 0 ? (
          <button className="reader__toc-up" onClick={() => setPath(path.slice(0, -1))} aria-label={`Back to ${parent.label}`}>
            ‹ <span>{parent.label}</span>
          </button>
        ) : null}
        <p className="reader__toc-here">{folder.label}</p>
      </div>
      <ol className="reader__toc-list" ref={listRef}>
        {folder.children.map((n) =>
          n.type === 'folder' ? (
            <li key={n.key}>
              <button className="reader__toc-folder" onClick={() => setPath([...path, n.key])}>
                <span className="reader__toc-icon" aria-hidden="true">▸</span>
                <span className="reader__toc-label">{n.label}</span>
                <small>{n.count}</small>
              </button>
            </li>
          ) : (
            <li key={n.id}>
              <button className={n.id === currentId ? 'is-current' : ''} onClick={() => onPick(n.id)}>
                <span className="reader__toc-label">{n.title}</span>
                {n.date && <small>{n.date}</small>}
              </button>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}

export function firstItem(collKey) {
  const c = collections[collKey];
  return c && c.sections[0].items[0].id;
}

export default function Reader({ collKey, itemId, onNavigate, onClose }) {
  const coll = collections[collKey];
  const flat = useMemo(
    () => coll.sections.flatMap((s) => s.items.map((it) => ({ ...it, section: s }))),
    [coll]
  );
  const index = Math.max(0, flat.findIndex((it) => it.id === itemId));
  const item = flat[index];
  const prev = flat[index - 1];
  const next = flat[index + 1];

  const [settings, setSettings] = useState(() => loadSettings(collKey));
  const [panel, setPanel] = useState(null); // null | 'contents' | 'settings'
  const [state, setState] = useState({ status: 'loading', html: '' });
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => saveSettings(collKey, settings), [collKey, settings]);

  // Fetch the text
  useEffect(() => {
    let alive = true;
    const url = `${import.meta.env.BASE_URL}texts/${collKey}/${item.id}.md`;
    const done = (html) => alive && setState({ status: 'ready', html });
    if (cache.has(url)) done(cache.get(url));
    else {
      setState({ status: 'loading', html: '' });
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        })
        .then((md) => {
          const html = renderMarkdown(md, `${import.meta.env.BASE_URL}texts/${collKey}/`);
          cache.set(url, html);
          done(html);
        })
        .catch(() => alive && setState({ status: 'error', html: '' }));
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setProgress(0);
    return () => {
      alive = false;
    };
  }, [collKey, item.id]);

  // Focus the reader so the keyboard works at once
  useEffect(() => {
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
  }, []);

  // Keyboard: Escape closes a panel, then the reader; arrows turn the page
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (panel) setPanel(null);
        else onClose();
      } else if (!panel && e.key === 'ArrowRight' && next) onNavigate(next.id);
      else if (!panel && e.key === 'ArrowLeft' && prev) onNavigate(prev.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel, next, prev, onClose, onNavigate]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 1);
  };

  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const toggle = (name) => setPanel((p) => (p === name ? null : name));
  const go = (id) => {
    setPanel(null);
    onNavigate(id);
  };

  return (
    <div
      className={`reader reader--${settings.theme} reader--${settings.font}`}
      style={{ '--reader-size': `${SIZES[settings.size]}px` }}
      role="dialog"
      aria-modal="true"
      aria-label={`${coll.title}: ${item.title}`}
      lang={coll.lang}
      onMouseMove={(e) => e.stopPropagation()}
    >
      <header className="reader__bar">
        <button className="reader__btn" onClick={() => toggle('contents')} aria-expanded={panel === 'contents'}>
          ☰ <span className="reader__btn-label">Contents</span>
        </button>
        <span className="reader__coll">{coll.title}</span>
        <button className="reader__btn" onClick={() => toggle('settings')} aria-expanded={panel === 'settings'} aria-label="Reading settings">
          Aa
        </button>
        <button className="reader__btn" ref={closeRef} onClick={onClose} aria-label="Close the reader">
          ✕
        </button>
        <span className="reader__progress" style={{ transform: `scaleX(${progress})` }} />
      </header>

      {panel === 'settings' && (
        <div className="reader__panel reader__panel--settings">
          <div className="reader__row" role="group" aria-label="Paper">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`reader__chip reader__chip--${t.id} ${settings.theme === t.id ? 'is-on' : ''}`}
                onClick={() => set({ theme: t.id })}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="reader__row" role="group" aria-label="Typeface">
            {FONTS.map((f) => (
              <button
                key={f.id}
                className={`reader__chip reader__chip--${f.id} ${settings.font === f.id ? 'is-on' : ''}`}
                onClick={() => set({ font: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="reader__row" role="group" aria-label="Text size">
            <button className="reader__chip" disabled={settings.size === 0} onClick={() => set({ size: settings.size - 1 })}>
              A−
            </button>
            <span className="reader__size">{SIZES[settings.size]} px</span>
            <button
              className="reader__chip"
              disabled={settings.size === SIZES.length - 1}
              onClick={() => set({ size: settings.size + 1 })}
            >
              A+
            </button>
          </div>
        </div>
      )}

      {panel === 'contents' && <Contents coll={coll} currentId={item.id} onPick={go} />}

      <div className="reader__scroll" ref={scrollRef} onScroll={onScroll} onClick={() => panel && setPanel(null)}>
        <article className="reader__page">
          <p className="reader__kicker">
            {[item.section.group, item.section.title].filter(Boolean).join(' · ')}
          </p>
          <h1 className="reader__title">{item.title}</h1>
          {(item.date || item.note) && (
            <p className="reader__meta">{[item.date, item.note].filter(Boolean).join(' · ')}</p>
          )}
          {state.status === 'loading' && <p className="reader__status">…</p>}
          {state.status === 'error' && <p className="reader__status">This text could not be loaded.</p>}
          {state.status === 'ready' && (
            <div className="reader__text" dangerouslySetInnerHTML={{ __html: state.html }} />
          )}

          <nav className="reader__turn" aria-label="Previous and next">
            {prev ? (
              <button onClick={() => onNavigate(prev.id)}>
                <small>← Previous</small>
                <span>{prev.title}</span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button className="reader__turn-next" onClick={() => onNavigate(next.id)}>
                <small>Next →</small>
                <span>{next.title}</span>
              </button>
            ) : (
              <button className="reader__turn-next" onClick={onClose}>
                <small>The end</small>
                <span>Back to the site</span>
              </button>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
