// shaderHub.js
// Paints every cube face from a single place.
//
// A face's "source" is either:
//   { fragment, scale }  — a fragment shader, rendered by one shared offscreen
//                          WebGL renderer and copied into the face's 2D canvas;
//   { painter, scale }   — a factory returning { paint(ctx, w, h, time) }, for
//                          effects that keep state between frames (Game of Life).
//
// Only "active" faces are redrawn every frame; the others keep their last image.
// The source of a face can be swapped at any time (the back face changes with
// the domain it is reached from).
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
} from 'three';
import { vertexShader } from './CustomShaders';

const TIME_SCALE = 0.6; // matches the old "+0.01 per frame" speed at 60 fps

class ShaderHub {
  constructor() {
    this.entries = new Map();
    this.renderer = null;
    this.failed = false;
    this.raf = null;
    this.start = performance.now();
  }

  init() {
    if (this.renderer || this.failed) return !this.failed;
    try {
      this.renderer = new WebGLRenderer({ antialias: false, alpha: false });
      this.scene = new Scene();
      this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.mesh = new Mesh(new PlaneGeometry(2, 2));
      this.scene.add(this.mesh);
      return true;
    } catch (e) {
      console.warn('WebGL unavailable, shader faces fall back to CSS gradients', e);
      this.failed = true;
      return false;
    }
  }

  // Build what an entry needs to draw a given source
  prepare(source) {
    if (source.painter) {
      return { painter: source.painter(), material: null, scale: source.scale || 1 };
    }
    if (!this.init()) return null;
    const material = new ShaderMaterial({
      uniforms: {
        resolution: { value: new Vector2() },
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader: source.fragment,
    });
    return { painter: null, material, scale: source.scale || 1 };
  }

  release(entry) {
    if (entry && entry.material) entry.material.dispose();
  }

  register(id, canvas, source) {
    const prepared = this.prepare(source);
    if (!prepared) return () => {};
    this.entries.set(id, {
      canvas,
      ctx: canvas.getContext('2d'),
      source,
      ...prepared,
      active: false,
      drawn: false,
    });
    this.loop();
    return () => {
      this.release(this.entries.get(id));
      this.entries.delete(id);
    };
  }

  // Swap what a face shows (no-op if it already shows this source)
  setSource(id, source) {
    const entry = this.entries.get(id);
    if (!entry || entry.source === source) return;
    const prepared = this.prepare(source);
    if (!prepared) return;
    this.release(entry);
    Object.assign(entry, prepared, { source, drawn: false });
  }

  setActive(ids) {
    this.entries.forEach((entry, id) => {
      entry.active = ids.includes(id);
    });
  }

  draw(entry, time) {
    const { canvas, ctx, scale } = entry;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const h = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    if (entry.painter) {
      entry.painter.paint(ctx, w, h, time);
    } else {
      this.renderer.setSize(w, h, false);
      entry.material.uniforms.resolution.value.set(w, h);
      entry.material.uniforms.time.value = time;
      this.mesh.material = entry.material;
      this.renderer.render(this.scene, this.camera);
      ctx.drawImage(this.renderer.domElement, 0, 0);
    }
    entry.drawn = true;
  }

  loop() {
    if (this.raf) return;
    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const time = ((performance.now() - this.start) / 1000) * TIME_SCALE;
      this.entries.forEach((entry) => {
        // Inactive faces still get one first frame so they are never blank
        if (entry.active || !entry.drawn) this.draw(entry, time);
      });
    };
    tick();
  }
}

export const shaderHub = new ShaderHub();
export const webglAvailable = () => shaderHub.init();
