// Cube.js
// A CSS 3D cube. Each face has a live shader background (see shaderHub.js)
// and an opaque card on top, so text stays crisp and links stay real links.
//
// The rotation is animated in JavaScript (not a CSS transition) so we can:
//   - zoom out while turning and zoom back in on arrival,
//   - light each face according to where it points (the cube reads as a volume),
//   - add a slight idle sway and mouse parallax,
//   - spin it all the way round to reach "the other side" (passions, not work).
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Cube.css';
import { shaderHub, webglAvailable } from './shaderHub';
import {
  fragmentShaderPixelatedNeon,
  fragmentShaderGitGraph,
  fragmentShaderPianoRoll,
  fragmentShaderTracker,
  fragmentShaderStarfield,
  fragmentShaderInk,
  fragmentShaderMandelbrotZoom,
  fragmentShaderCoaster,
  fragmentShaderUpsideDown,
  fragmentShaderTea,
  fragmentShaderStream,
  fragmentShaderLibrary,
} from './CustomShaders';
import { createGameOfLife } from './gameOfLife';
import { createSnake } from './snake';
import { profile, domains, otherProfile, passions } from '../data/content';
import { coasters } from '../data/coasters';

// ---------- Tuning ----------
const TURN_MS = 650;         // duration of a rotation
const ZOOM_OUT = 0.14;       // how much the cube shrinks mid-rotation (0 = none)
const SWAY_DEG = 1.6;        // idle sway amplitude
const PARALLAX_DEG = 1.5;    // extra tilt following the mouse
const MAX_PROJECTS_PER_FACE = 5; // beyond this, the rest goes to another face
const FLIP_MS = 1300;        // the full turn to the other side
const FLIP_ZOOM_OUT = 0.32;  // it shrinks more for that one
const TOP_COASTERS = 5;      // shown on the Coasters face

// What each face shows. A source is a fragment shader or a JS "painter".
const SHADERS = {
  front: { fragment: fragmentShaderPixelatedNeon, scale: 1 },
  right: { fragment: fragmentShaderGitGraph, scale: 1 },
  left: { fragment: fragmentShaderTracker, scale: 1 },
  top: { fragment: fragmentShaderStarfield, scale: 1 },
  bottom: { fragment: fragmentShaderInk, scale: 1 },
  back: { fragment: fragmentShaderMandelbrotZoom, scale: 0.5 },
};

// The other side has its own backgrounds
const OTHER_SHADERS = {
  front: { fragment: fragmentShaderUpsideDown, scale: 1 },
  right: { fragment: fragmentShaderCoaster, scale: 1 },
  left: { fragment: fragmentShaderTea, scale: 1 },
  top: { fragment: fragmentShaderStream, scale: 1 },
  bottom: { fragment: fragmentShaderLibrary, scale: 1 },
  back: { fragment: fragmentShaderUpsideDown, scale: 1 },
};
const SIDE_SHADERS = { work: SHADERS, other: OTHER_SHADERS };

// The back face changes with the domain it is reached from
const BACK_SHADERS = {
  right: { painter: createGameOfLife, scale: 1 },        // development
  left: { fragment: fragmentShaderPianoRoll, scale: 1 },   // music
  top: { painter: createSnake, scale: 1 },                 // games
  bottom: SHADERS.back,                                    // writing: Mandelbrot, the library of Babel
};
// On the other side, a sheet keeps the background of the face it comes from
const OTHER_BACK_SHADERS = OTHER_SHADERS;
const backShader = (side, domainFace) => (side === 'work' ? BACK_SHADERS : OTHER_BACK_SHADERS)[domainFace];

// Rotation (degrees) of each face inside the cube — must match Cube.css
const FACE_ROTATION = {
  front: { rx: 0, ry: 0 },
  right: { rx: 0, ry: 90 },
  left: { rx: 0, ry: -90 },
  top: { rx: 90, ry: 0 },
  bottom: { rx: -90, ry: 0 },
  back: { rx: 0, ry: 180 },
};

// Cube rotation that brings each face in front of the visitor
const TARGET = {
  front: { rx: 0, ry: 0 },
  right: { rx: 0, ry: -90 },
  left: { rx: 0, ry: 90 },
  top: { rx: -90, ry: 0 },
  bottom: { rx: 90, ry: 0 },
  back: { rx: 0, ry: 180 },
};

// Where the "Home" tab sits on each domain face: on the edge facing home
const HOME_EDGE = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' };
const ARROWS = { left: '◀', right: '▶', top: '▲', bottom: '▼' };

// Light comes from the viewer, slightly from the top left (CSS y points down)
const LIGHT = (() => {
  const v = [-0.35, -0.45, 1];
  const n = Math.hypot(...v);
  return v.map((c) => c / n);
})();

const nearest = (current, target) => target + 360 * Math.round((current - target) / 360);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const byFace = (list) => Object.fromEntries(Object.entries(list).map(([key, d]) => [d.face, { key, ...d }]));
const SIDES = { work: byFace(domains), other: byFace(passions) };

// Version and build day, set by vite.config.js: "v1.0.0 · Updated October 2026"
const STAMP = `v${__APP_VERSION__} · Updated ${new Date(__BUILD_DATE__).toLocaleDateString('en-GB', {
  month: 'long',
  year: 'numeric',
})}`;

const topCoasters = [...coasters].sort((a, b) => a.rank - b.rank).slice(0, TOP_COASTERS);

// Shrinks the text of a card until it fits: cards never scroll.
function useFitText(ref, deps) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      let scale = 1;
      el.style.setProperty('--fit', scale);
      while (el.scrollHeight > el.clientHeight + 1 && scale > 0.4) {
        scale -= 0.03;
        el.style.setProperty('--fit', scale.toFixed(2));
      }
    };
    fit();
    let frame;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    // Refit when the face is resized. Watch the face (its size never depends on
    // the text), not the card itself: shrinking the text changes the card's
    // padding, which would re-trigger the observer in a loop.
    const ro = new ResizeObserver(refit);
    ro.observe(el.parentElement || el);
    // Refit when the card's content changes (another project, hot reload of
    // content.js...). Attributes are not watched, so setting --fit cannot loop.
    const mo = new MutationObserver(refit);
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    // Refit when an image inside the card finishes loading ('load' does not
    // bubble, hence the capture phase), and once the fonts are ready.
    el.addEventListener('load', refit, true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener('load', refit, true);
    };
  }, deps);
}

function Card({ className = '', children, fitKey }) {
  const ref = useRef(null);
  useFitText(ref, [fitKey]);
  return (
    <div ref={ref} className={`card ${className}`}>
      {children}
    </div>
  );
}

function ShaderCanvas({ face }) {
  const ref = useRef(null);
  useEffect(() => shaderHub.register(face, ref.current, SHADERS[face]), [face]);
  return <canvas ref={ref} className="face__shader" aria-hidden="true" />;
}

function Face({ name, active, shadeRef, children }) {
  const ref = useRef(null);
  // Hidden faces must not be reachable with the keyboard or screen readers
  useEffect(() => {
    if (!ref.current) return;
    if (active) ref.current.removeAttribute('inert');
    else ref.current.setAttribute('inert', '');
  }, [active]);
  return (
    <section ref={ref} className={`face face--${name} ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <ShaderCanvas face={name} />
      <div className="face__content">{children}</div>
      <div className="face__shade" ref={shadeRef} aria-hidden="true" />
      <div className="face__edge" aria-hidden="true" />
    </section>
  );
}

function MailLink({ email }) {
  const [href, setHref] = useState(null);
  useEffect(() => {
    if (email && email.user && email.domain) setHref(`${email.user}@${email.domain}`);
  }, [email]);
  if (!href) return null;
  return <a href={`mailto:${href}`}>{href}</a>;
}

function EdgeTab({ edge, label, onClick }) {
  const arrow = <span className="edge-tab__arrow">{ARROWS[edge]}</span>;
  const before = edge === 'left' || edge === 'top';
  return (
    <button className={`edge-tab edge-tab--${edge}`} onClick={onClick}>
      {before && arrow}
      {before ? ' ' : ''}
      {label}
      {before ? '' : ' '}
      {!before && arrow}
    </button>
  );
}

export default function Cube({ reading = false, onRead, onCoasters, onSideChange }) {
  const [face, setFace] = useState('front');
  const [side, setSide] = useState('work'); // 'work' | 'other'
  const domainByFace = SIDES[side];
  // What the back face shows: a project sheet, or the overflow of a domain list
  const [back, setBack] = useState(null); // { kind: 'project'|'more', domainFace, project? }
  const [hasWebgl] = useState(() => webglAvailable());

  const cubeRef = useRef(null);
  const shadeRefs = useRef({});
  const faceRef = useRef('front');
  const pose = useRef({ rx: 0, ry: 0 });
  const anim = useRef({ from: { rx: 0, ry: 0 }, to: { rx: 0, ry: 0 }, start: 0, duration: 0, zoom: ZOOM_OUT });
  const sideRef = useRef('work');
  const onSideChangeRef = useRef(onSideChange);
  onSideChangeRef.current = onSideChange;
  const flipping = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const touch = useRef(null);
  const settleTimer = useRef(null);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ---------- Animation loop ----------
  useEffect(() => {
    let raf;
    const faces = Object.keys(FACE_ROTATION);
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const a = anim.current;
      const p = a.duration ? Math.min(1, (now - a.start) / a.duration) : 1;
      const e = ease(p);
      const rx = a.from.rx + (a.to.rx - a.from.rx) * e;
      const ry = a.from.ry + (a.to.ry - a.from.ry) * e;
      pose.current = { rx, ry };

      const zoom = 1 - a.zoom * Math.sin(Math.PI * p);
      const t = now / 1000;
      const still = reduceMotion.current;
      const sx = still ? 0 : Math.sin(t * 0.45) * SWAY_DEG - mouse.current.y * PARALLAX_DEG;
      const sy = still ? 0 : Math.sin(t * 0.33 + 1) * SWAY_DEG + mouse.current.x * PARALLAX_DEG;

      if (cubeRef.current) {
        cubeRef.current.style.transform =
          `translateZ(calc(var(--cube-size) / -2)) rotateX(${sx}deg) rotateY(${sy}deg) ` +
          `scale3d(${zoom}, ${zoom}, ${zoom}) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      // Light each face from its orientation
      const view = new DOMMatrix()
        .rotateAxisAngleSelf(1, 0, 0, sx)
        .rotateAxisAngleSelf(0, 1, 0, sy)
        .rotateAxisAngleSelf(1, 0, 0, rx)
        .rotateAxisAngleSelf(0, 1, 0, ry);
      faces.forEach((name) => {
        const el = shadeRefs.current[name];
        if (!el) return;
        const fr = FACE_ROTATION[name];
        const m = view
          .rotateAxisAngle(1, 0, 0, fr.rx)
          .rotateAxisAngle(0, 1, 0, fr.ry);
        const n = m.transformPoint(new DOMPoint(0, 0, 1, 0));
        const lit = n.x * LIGHT[0] + n.y * LIGHT[1] + n.z * LIGHT[2];
        // Zero when facing us, darker as it turns away from the light
        const shade = Math.min(0.85, Math.max(0, (LIGHT[2] - lit) * 1.6));
        el.style.opacity = shade.toFixed(3);
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mouse parallax (desktop only)
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    shaderHub.setActive(['front']);
  }, []);

  // ---------- Navigation ----------
  const go = useCallback((next) => {
    const previous = faceRef.current;
    if (next === previous || flipping.current) return;
    const target = TARGET[next];
    const from = pose.current;
    // Faces reached around the vertical axis keep rx at 0 (mod 360),
    // faces reached around the horizontal axis keep ry at 0 (mod 360).
    const horizontal = next === 'left' || next === 'right' || next === 'back';
    const to = horizontal
      ? { rx: nearest(from.rx, 0), ry: nearest(from.ry, target.ry) }
      : { rx: nearest(from.rx, target.rx), ry: nearest(from.ry, 0) };
    anim.current = {
      from,
      to,
      start: performance.now(),
      duration: reduceMotion.current ? 0 : TURN_MS,
      zoom: ZOOM_OUT,
    };
    faceRef.current = next;
    setFace(next);
    shaderHub.setActive([previous, next]);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => shaderHub.setActive([next]), TURN_MS + 100);
  }, []);

  // ---------- The other side ----------
  // A full turn around the vertical axis; the faces change subject halfway,
  // while the home face looks away.
  const flip = useCallback(() => {
    if (faceRef.current !== 'front' || flipping.current) return;
    const next = sideRef.current === 'work' ? 'other' : 'work';
    const duration = reduceMotion.current ? 0 : FLIP_MS;
    const from = pose.current;
    const swap = () => {
      sideRef.current = next;
      setSide(next);
      if (onSideChangeRef.current) onSideChangeRef.current(next);
      Object.entries(SIDE_SHADERS[next]).forEach(([name, source]) => shaderHub.setSource(name, source));
    };
    setBack(null);
    flipping.current = true;
    anim.current = {
      from,
      to: { rx: nearest(from.rx, 0), ry: nearest(from.ry, 0) + (next === 'other' ? 360 : -360) },
      start: performance.now(),
      duration,
      zoom: FLIP_ZOOM_OUT,
    };
    shaderHub.setActive(['front', 'right', 'back', 'left']);
    window.clearTimeout(settleTimer.current);
    if (!duration) swap();
    else window.setTimeout(swap, duration / 2);
    settleTimer.current = window.setTimeout(() => {
      flipping.current = false;
      shaderHub.setActive(['front']);
    }, duration + 100);
  }, []);

  const openProject = (domainFace, project) => {
    setBack({ kind: 'project', domainFace, project });
    shaderHub.setSource('back', backShader(sideRef.current, domainFace));
    go('back');
  };
  const openMore = (domainFace) => {
    setBack({ kind: 'more', domainFace });
    shaderHub.setSource('back', backShader(sideRef.current, domainFace));
    go('back');
  };

  const goBack = useCallback(() => {
    const current = faceRef.current;
    if (current === 'back' && back) go(back.domainFace);
    else if (current !== 'front') go('front');
  }, [back, go]);

  // While the reader is open, the cube rests: no keys, no shaders
  const readingRef = useRef(reading);
  useEffect(() => {
    readingRef.current = reading;
    shaderHub.setActive(reading ? [] : [faceRef.current]);
  }, [reading]);

  // Keyboard: arrows on the home face, Escape / Backspace to go back
  useEffect(() => {
    const onKey = (e) => {
      if (readingRef.current) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        goBack();
        return;
      }
      if (faceRef.current !== 'front') return;
      const map = { ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'top', ArrowDown: 'bottom' };
      if (map[e.key]) go(map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, goBack]);

  // Swipe: on the home face, swipe toward a domain; elsewhere, swipe to go back
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    if (faceRef.current === 'front') {
      // Dragging the cube left reveals its right face, and so on
      go({ left: 'right', right: 'left', up: 'bottom', down: 'top' }[dir]);
    } else {
      goBack();
    }
  };

  const shadeRef = (name) => (el) => {
    shadeRefs.current[name] = el;
  };

  const backDomain = back && domainByFace[back.domainFace];

  return (
    <div className={`cube-scene ${hasWebgl ? '' : 'no-webgl'}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="cube" ref={cubeRef}>
        {/* FRONT — home */}
        <Face name="front" active={face === 'front'} shadeRef={shadeRef('front')}>
          {Object.values(domainByFace).map((d) => (
            <EdgeTab key={d.face} edge={d.face} label={d.short} onClick={() => go(d.face)} />
          ))}
          <button
            className="flip-tab"
            onClick={flip}
            aria-label={side === 'work' ? 'Turn the cube: the other side' : 'Turn the cube back: work'}
            title={side === 'work' ? 'The other side' : 'Back to work'}
          >
            ↻
          </button>
          <Card className={`card--home ${side === 'other' ? 'card--other' : ''}`} fitKey={`home-${side}`}>
            <h1>
              <button className="card__name" onClick={flip} title={side === 'work' ? 'The other side' : 'Back to work'}>
                {profile.name}
              </button>
            </h1>
            <p className="card__role">{side === 'work' ? profile.role : otherProfile.role}</p>
            {(side === 'work' ? profile.bio : otherProfile.bio).map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="card__contact">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <MailLink email={profile.email} />
            </p>
            <p className="card__stamp">{STAMP}</p>
          </Card>
        </Face>

        {/* SIDES — one domain each */}
        {Object.values(domainByFace).map((d) => {
          const edge = HOME_EDGE[d.face];
          const shown = d.projects.length > MAX_PROJECTS_PER_FACE
            ? d.projects.slice(0, MAX_PROJECTS_PER_FACE - 1)
            : d.projects;
          const rest = d.projects.length - shown.length;
          return (
            <Face key={d.face} name={d.face} active={face === d.face} shadeRef={shadeRef(d.face)}>
              <EdgeTab edge={edge} label="Home" onClick={() => go('front')} />
              <Card className="card--domain" fitKey={`${side}-${d.face}`}>
                <h2>{d.title}</h2>
                <p className="card__intro">{d.intro}</p>
                {d.coasters && (
                  <>
                    <ol className="coaster-top">
                      {topCoasters.map((c) => (
                        <li key={c.id}>
                          <span className="coaster-top__rank">{c.rank}</span>
                          <span className="coaster-top__name">{c.name}</span>
                          <span className="coaster-top__park">{c.park}</span>
                          <span className="coaster-top__score">{c.score.toFixed(1)} %</span>
                        </li>
                      ))}
                    </ol>
                    {onCoasters && (
                      <button className="card__open card__read" onClick={onCoasters}>
                        All {coasters.length} coasters →
                      </button>
                    )}
                  </>
                )}
                {d.notes &&
                  d.notes.map((note) => (
                    <section key={note.title} className="card__section">
                      <h3>{note.title}</h3>
                      <p>{note.text}</p>
                    </section>
                  ))}
                {d.shelves && (
                  <ul className="shelves">
                    {d.shelves.map((shelf) => (
                      <li key={shelf.title}>
                        <span className="shelves__title">{shelf.title}</span>
                        <span className="shelves__authors">
                          {shelf.authors.map((a) => (
                            <span key={a}>{a}</span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {d.projects.length > 0 && <ul className="project-list">
                  {shown.map((p) => (
                    <li key={p.id}>
                      <button className="project-item" onClick={() => openProject(d.face, p)}>
                        <span className="project-item__name">{p.name}</span>
                        <span className="project-item__summary">{p.summary}</span>
                      </button>
                    </li>
                  ))}
                  {rest > 0 && (
                    <li>
                      <button className="project-item project-item--more" onClick={() => openMore(d.face)}>
                        <span className="project-item__name">{rest} more →</span>
                      </button>
                    </li>
                  )}
                </ul>}
              </Card>
            </Face>
          );
        })}

        {/* BACK — project sheet, or the rest of a long list */}
        <Face name="back" active={face === 'back'} shadeRef={shadeRef('back')}>
          {back && (
            <Card className="card--sheet" fitKey={`${back.kind}-${back.project ? back.project.id : back.domainFace}`}>
              <button className="card__back" onClick={goBack}>↩ {backDomain.title}</button>
              {back.kind === 'project' ? (
                <>
                  {back.project.image && (
                    <img
                      className="card__image"
                      src={`${import.meta.env.BASE_URL}${back.project.image}`}
                      alt={back.project.imageAlt || ''}
                      style={
                        back.project.imageFit === 'contain'
                          ? { objectFit: 'contain', objectPosition: 'center', background: back.project.imageBackground }
                          : undefined
                      }
                    />
                  )}
                  <div className="card__heading">
                    <h2>{back.project.name}</h2>
                    <span className="card__year">{back.project.year}</span>
                  </div>
                  <ul className="card__tech">
                    {back.project.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p className="card__summary">{back.project.summary}</p>
                  {back.project.sections
                    ? back.project.sections.map((section) => (
                        <section key={section.title} className="card__section">
                          <h3>{section.title}</h3>
                          <p>{section.text}</p>
                        </section>
                      ))
                    : (back.project.details || []).map((line) => <p key={line}>{line}</p>)}
                  {back.project.reader && onRead && (
                    <button className="card__open card__read" onClick={() => onRead(back.project.reader)}>
                      {back.project.readerLabel || 'Start reading'} →
                    </button>
                  )}
                  {back.project.url && (
                    <a className="card__open" href={back.project.url} target="_blank" rel="noreferrer">
                      {back.project.linkLabel || `Open ${back.project.name}`} ↗
                    </a>
                  )}
                </>
              ) : (
                <>
                  <h2>{backDomain.title}</h2>
                  <ul className="project-list">
                    {backDomain.projects.slice(MAX_PROJECTS_PER_FACE - 1).map((p) => (
                      <li key={p.id}>
                        <button
                          className="project-item"
                          onClick={() => setBack({ kind: 'project', domainFace: back.domainFace, project: p })}
                        >
                          <span className="project-item__name">{p.name}</span>
                          <span className="project-item__summary">{p.summary}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          )}
        </Face>
      </div>
    </div>
  );
}
