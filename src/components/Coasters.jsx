// The full coaster ranking: a full-screen page laid over the cube, opened from
// the Coasters face of the other side. Address: #/coasters
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { coasters, PARKS, parkCount, SCORES_DATE } from '../data/coasters';
import './Coasters.css';

const SORTS = [
  ['rank', 'Score'],
  ['name', 'Name'],
  ['park', 'Park'],
  ['maker', 'Manufacturer'],
  ['year', 'Year'],
  ['height', 'Height'],
  ['speed', 'Speed'],
  ['inversions', 'Inversions'],
];
// Text and dates read best from A to Z / oldest first; sizes from biggest
const ASCENDING_FIRST = ['rank', 'name', 'park', 'maker', 'year'];

const pct = (v) => (v == null ? '—' : `${v.toFixed(1)} %`);
const unit = (v, u) => (v == null ? null : `${v} ${u}`);

// Each manufacturer, with its best coaster, best first
const makers = (() => {
  const m = new Map();
  coasters.forEach((c) => {
    const e = m.get(c.maker) || { name: c.maker, count: 0, best: null };
    e.count += 1;
    if (c.score != null && (!e.best || c.score > e.best.score)) e.best = c;
    m.set(c.maker, e);
  });
  return [...m.values()].sort((a, b) => (b.best ? b.best.score : -1) - (a.best ? a.best.score : -1));
})();

const unscored = coasters.filter((c) => c.score == null).map((c) => c.name);

export default function Coasters({ onClose }) {
  const [park, setPark] = useState(null);
  const [maker, setMaker] = useState(null);
  const [sort, setSort] = useState({ key: 'rank', dir: 1 });
  const closeRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const list = useMemo(() => {
    const { key, dir } = sort;
    return coasters
      .filter((c) => (!park || c.park === park) && (!maker || c.maker === maker))
      .sort((a, b) => {
        let x = a[key];
        let y = b[key];
        if (x == null) x = dir === 1 ? Infinity : -Infinity;
        if (y == null) y = dir === 1 ? Infinity : -Infinity;
        if (typeof x === 'string') return x.localeCompare(y, 'fr') * dir;
        return (x - y) * dir;
      });
  }, [park, maker, sort]);

  const pickSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: ASCENDING_FIRST.includes(key) ? 1 : -1 }));

  const pickMaker = (name) => {
    setMaker((m) => (m === name ? null : name));
    setPark(null);
    if (listRef.current) listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="coasters" role="dialog" aria-modal="true" aria-label="Coaster ranking" onMouseMove={(e) => e.stopPropagation()}>
      <button className="coasters__close" ref={closeRef} onClick={onClose} aria-label="Close the ranking">
        ✕
      </button>
      <div className="coasters__page">
        <header className="coasters__top">
          <p className="coasters__kick">
            {parkCount} parks · {coasters.length} coasters · and counting
          </p>
          <h1>
            The ranking,
            <br />
            <em>all parks</em>
          </h1>
          <p className="coasters__lead">
            Every roller coaster I have ridden so far, ranked in a single list by their Captain Coaster score. Filter by
            park or manufacturer, sort by whatever you like.
          </p>
        </header>

        <div className="coasters__controls">
          <p className="coasters__lbl">Park</p>
          <div className="coasters__chips">
            <button type="button" aria-pressed={!park} onClick={() => setPark(null)}>
              All
            </button>
            {Object.entries(PARKS).map(([name, colour]) => (
              <button
                key={name}
                type="button"
                style={{ '--c': colour }}
                aria-pressed={park === name}
                onClick={() => {
                  setPark(name);
                  setMaker(null);
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="coasters__lbl coasters__lbl--next">Sort by</p>
          <div className="coasters__chips">
            {SORTS.map(([key, label]) => (
              <button key={key} type="button" aria-pressed={sort.key === key} onClick={() => pickSort(key)}>
                {label}
                {sort.key === key && <span className="coasters__dir">{sort.dir === 1 ? '↑' : '↓'}</span>}
              </button>
            ))}
          </div>
          {maker && (
            <p className="coasters__filter">
              Showing {maker} only ·{' '}
              <button type="button" onClick={() => setMaker(null)}>
                show all
              </button>
            </p>
          )}
        </div>

        <ol className="coasters__list" ref={listRef}>
          {list.map((c) => (
            <li key={c.id} className="coasters__ride" style={{ '--c': PARKS[c.park] }}>
              <span className="coasters__n" aria-label={`Rank ${c.rank}`}>
                {String(c.rank).padStart(2, '0')}
              </span>
              <div>
                <p className="coasters__meta">
                  <b>{c.maker}</b> · <i>{c.park}</i> · {c.year}
                </p>
                <h3>
                  {c.name}
                  {c.wood ? <span className="coasters__wood">wood</span> : null}
                </h3>
                <div className={`coasters__gauge ${c.score == null ? 'is-none' : ''}`}>
                  <i style={{ width: `${c.score || 0}%` }} />
                  <span>{pct(c.score)}</span>
                </div>
                <p className="coasters__stats">
                  {[
                    c.type,
                    unit(c.height, 'm'),
                    unit(c.speed, 'km/h'),
                    unit(c.length, 'm long'),
                    c.inversions ? `${c.inversions} inversion${c.inversions > 1 ? 's' : ''}` : null,
                  ]
                    .filter(Boolean)
                    .map((s, i) => (
                      <React.Fragment key={s}>
                        {i > 0 && ' · '}
                        <span>{s}</span>
                      </React.Fragment>
                    ))}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="coasters__act">The manufacturers</p>
        <div className="coasters__makers">
          <table>
            <thead>
              <tr>
                <th scope="col">Manufacturer</th>
                <th scope="col" className="num">
                  Ridden
                </th>
                <th scope="col">Their best</th>
                <th scope="col" className="num">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {makers.map((m) => (
                <tr key={m.name} aria-selected={maker === m.name} onClick={() => pickMaker(m.name)}>
                  <td className="maker">
                    <button type="button" onClick={(e) => {
                      e.stopPropagation();
                      pickMaker(m.name);
                    }}>
                      {m.name}
                    </button>
                  </td>
                  <td className="num">{m.count}</td>
                  <td>{m.best ? m.best.name : '—'}</td>
                  <td className="num">{pct(m.best ? m.best.score : null)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="coasters__note">
          <p>
            Scores read on Captain Coaster on {SCORES_DATE}. A score is a <b>satisfaction percentage</b> from the
            community&apos;s votes, not a mark out of 100: compare coasters with one another.
          </p>
          <p>Click a manufacturer to see only its coasters; click it again to see them all.</p>
          {unscored.length > 0 && (
            <p>
              {unscored.length} coasters have no score on Captain Coaster yet: {unscored.join(', ')}. They come last,
              with an empty gauge.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
