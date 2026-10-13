// CustomShaders.js
// One fragment shader per cube face. All of them receive:
//   varying vec4 vPosition  -> face coordinates in [-1, 1]
//   uniform vec2 resolution -> size of the face canvas in pixels
//   uniform float time      -> seconds since start (scaled)

// Vertex shader for a full-face quad (PlaneGeometry 2x2)
export const vertexShader = `
    varying vec4 vPosition;

    void main() {
        vPosition = vec4(position.xy, 0.0, 1.0);
        gl_Position = vPosition;
    }
`;

// Helpers shared by several shaders
const common = `
    varying vec4 vPosition;
    uniform vec2 resolution;
    uniform float time;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Stable for large inputs (sin-based hashes degrade there)
    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    // Snap coordinates to a grid of "big pixels"
    vec2 pixelate(vec2 uv, float pixelSize) {
        float screenSize = min(resolution.x, resolution.y);
        return floor(uv * screenSize / pixelSize) / screenSize * pixelSize;
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.02;
            a *= 0.5;
        }
        return v;
    }
`;

// FRONT — home. The original pixelated neon of the site.
export const fragmentShaderPixelatedNeon = `
    ${common}

    vec3 palette( float t) {
        vec3 a = vec3(0.2, 1., 1.);
        vec3 b = vec3(1., 0.5, 0.2);
        vec3 c = vec3(1., 0.2, 0.5);
        vec3 d = vec3(0.263, 0.416, 0.557);

        return a + b*cos( 4.2*(c*t+d) );
    }

    void main() {
        vec2 uv = vPosition.xy / vPosition.w;
        uv.x *= resolution.x / resolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);

        uv = pixelate(uv, 10.0);

        for (float i = 0.0; i < 4.0; i++) {
            uv = fract(uv * 1.5) - 0.5;
            float d = length(uv) * exp(-length(uv0));
            vec3 color = palette(length(uv0) + i*0.4 + time*0.1);
            d = sin(d * 8. + time*0.15) / 8.;
            d = abs(d);
            d = pow(0.01 / d, 1.5);
            finalColor += color * d;
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// RIGHT — development. Truchet circuit traces with signals running along them.
// Each tile holds two quarter arcs. Reading the arcs in alternate directions on a
// checkerboard makes every path continuous: a signal leaving a tile at s = 1
// enters the next one at s = 0, so it can travel across the whole board.
export const fragmentShaderCircuit = `
    ${common}

    void main() {
        vec2 uv = pixelate(vPosition.xy, 4.0);
        vec2 g = uv * 4.5;
        vec2 id = floor(g);
        vec2 f = fract(g) - 0.5;
        if (hash(id) > 0.5) f.x = -f.x;

        // Arc A around corner (0.5, 0.5), arc B around corner (-0.5, -0.5)
        vec2 va = f - vec2(0.5);
        vec2 vb = f + vec2(0.5);
        float da = abs(length(va) - 0.5);
        float db = abs(length(vb) - 0.5);
        float d;
        float a; // position along the arc, 0 → 1
        if (da < db) {
            d = da;
            a = (-1.5707963 - atan(va.y, va.x)) / 1.5707963;
        } else {
            d = db;
            a = (1.5707963 - atan(vb.y, vb.x)) / 1.5707963;
        }
        float even = step(mod(id.x + id.y, 2.0), 0.5);
        float s = mix(1.0 - a, a, even);

        float line = smoothstep(0.09, 0.0, d);

        // A signal head travels one tile per cycle, with a short fading tail
        float u = fract(time * 0.55 - s);
        float head = exp(-u * 11.0);
        // Signals are present only in slowly drifting regions of the board
        float region = smoothstep(0.64, 0.8, noise(uv * 1.3 + vec2(time * 0.06, -time * 0.04)));

        vec3 base = vec3(0.01, 0.03, 0.05);
        vec3 trace = vec3(0.06, 0.24, 0.24);
        vec3 glow = vec3(0.45, 1.0, 0.85);

        // The signal is brighter and slightly wider than the trace it runs on
        float signal = head * region;
        float halo = smoothstep(0.16, 0.0, d) * signal;
        vec3 col = base + line * trace + halo * glow * 1.6;

        // Solder pads where traces meet tile edges
        float pad = smoothstep(0.11, 0.07, min(
            min(length(f - vec2(0.5, 0.0)), length(f + vec2(0.5, 0.0))),
            min(length(f - vec2(0.0, 0.5)), length(f + vec2(0.0, 0.5)))));
        col += pad * vec3(0.10, 0.28, 0.32);

        gl_FragColor = vec4(col, 1.0);
    }
`;

// LEFT — music. Oscilloscope waves over a pixel spectrum analyser.
export const fragmentShaderWaves = `
    ${common}

    vec3 palette(float t) {
        return vec3(0.6, 0.4, 0.7) + 0.4 * cos(6.2831 * (t + vec3(0.0, 0.33, 0.67)));
    }

    void main() {
        vec2 uv = pixelate(vPosition.xy, 4.0);
        vec3 col = vec3(0.03, 0.0, 0.06);

        // Spectrum bars
        float bx = floor((uv.x + 1.0) * 12.0);
        float h = 0.2 + 0.35 * abs(sin(bx * 1.7 + time * 2.2) * sin(bx * 0.6 + time * 1.1));
        float bar = step(uv.y, -1.0 + h) * step(0.15, fract((uv.x + 1.0) * 12.0));
        col += bar * mix(vec3(1.0, 0.15, 0.5), vec3(1.0, 0.8, 0.2), (uv.y + 1.0) / h * 0.5) * 0.45;

        // Waves
        for (int i = 0; i < 5; i++) {
            float fi = float(i);
            float y = sin(uv.x * (2.5 + fi) + time * (0.7 + fi * 0.25) + fi * 1.3)
                    * 0.22 * sin(time * 0.3 + fi)
                    + (fi - 2.0) * 0.12 + 0.15;
            float d = abs(uv.y - y);
            col += palette(fi * 0.18 + time * 0.05) * 0.006 / max(d, 0.004);
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;

// TOP — games. Retro starfield with scanlines.
export const fragmentShaderStarfield = `
    ${common}

    void main() {
        vec2 uv = pixelate(vPosition.xy, 4.0);
        vec3 col = vec3(0.01, 0.0, 0.05) + vec3(0.08, 0.0, 0.12) * (1.0 - length(uv) * 0.6);

        for (int l = 0; l < 4; l++) {
            float fl = float(l);
            float z = fract(fl * 0.25 + time * 0.06);
            float scale = mix(18.0, 1.5, z);
            vec2 g = uv * scale + fl * 13.1;
            vec2 id = floor(g);
            vec2 f = fract(g) - 0.5;
            float h = hash(id + fl * 7.0);
            float star = step(length(f), 0.09 + z * 0.12) * step(0.88, h);
            float fade = smoothstep(0.0, 0.3, z) * smoothstep(1.0, 0.75, z);
            col += star * fade * mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 0.5, 0.9), h);
        }

        // Scanlines
        col *= 0.8 + 0.2 * sin(gl_FragCoord.y * 1.5708);

        gl_FragColor = vec4(col, 1.0);
    }
`;

// BOTTOM — writing. A page typing itself, in crisp pixel glyphs, with a
// blinking cursor. Glyphs come from a hash of their index, so the text stays
// stable while the page scrolls up.
export const fragmentShaderInk = `
    ${common}

    void main() {
        float px = max(2.0, floor(min(resolution.x, resolution.y) / 160.0));
        vec2 g = floor(vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / px);

        // Character cells: 6 x 10 big pixels (5 x 7 glyph + spacing).
        // Lines are 8 characters wider than the screen and start 4 characters
        // off-screen, so the text runs past both edges.
        float overflow = 4.0;
        float cols = floor(resolution.x / px / 6.0) + 2.0 * overflow;
        float lastRow = floor(resolution.y / px / 10.0) - 1.0; // last fully visible row
        float col = floor(g.x / 6.0) + overflow;
        float row = floor(g.y / 10.0);
        vec2 l = vec2(mod(g.x, 6.0), mod(g.y, 10.0));

        vec3 paper = vec3(0.05, 0.04, 0.12);
        vec3 ruled = vec3(0.09, 0.08, 0.20);
        vec3 c = paper;
        if (l.y == 8.0) c = ruled;

        // The page starts already filled; the line being typed is always the
        // last visible one, and the page scrolls up as lines are completed
        float typed = lastRow * cols + time * 14.0;
        float line = floor(typed / cols);
        float scroll = max(0.0, line - lastRow);
        float r = row + scroll;
        float index = r * cols + col;
        bool inside = col >= 0.0 && col < cols;
        bool written = index < floor(typed);
        bool space = hash12(vec2(index, 1.0)) < 0.17;

        // Letters built from segments (like a display font), so they read as text
        if (inside && written && !space && l.x < 5.0 && l.y < 7.0) {
            float on = 0.0;
            if (l.x == 0.0 && l.y <= 3.0) on += step(hash12(vec2(index, 11.0)), 0.5);
            if (l.x == 0.0 && l.y >= 3.0) on += step(hash12(vec2(index, 12.0)), 0.5);
            if (l.x == 4.0 && l.y <= 3.0) on += step(hash12(vec2(index, 13.0)), 0.5);
            if (l.x == 4.0 && l.y >= 3.0) on += step(hash12(vec2(index, 14.0)), 0.5);
            if (l.y == 0.0) on += step(hash12(vec2(index, 15.0)), 0.45);
            if (l.y == 3.0) on += step(hash12(vec2(index, 16.0)), 0.45);
            if (l.y == 6.0) on += step(hash12(vec2(index, 17.0)), 0.45);
            if (l.x == 2.0) on += step(hash12(vec2(index, 18.0)), 0.25);
            if (on > 0.0) {
                float age = typed - index;
                vec3 fresh = vec3(1.0, 0.8, 0.35);
                vec3 ink = vec3(0.86, 0.82, 0.7);
                c = mix(fresh, ink, clamp(age / 30.0, 0.0, 1.0));
            }
        }

        // Blinking block cursor
        float cursor = floor(typed);
        float cursorRow = floor(cursor / cols) - scroll;
        float cursorCol = mod(cursor, cols);
        if (row == cursorRow && col == cursorCol && l.x < 5.0 && l.y < 8.0 && fract(time * 1.6) < 0.55) {
            c = vec3(1.0, 0.8, 0.35);
        }

        gl_FragColor = vec4(c, 1.0);
    }
`;

// BACK — project sheet. Mandelbrot zoom, tinted.
export const fragmentShaderMandelbrotZoom = `
    ${common}

    float distanceToMandelbrot( in vec2 c )
    {
        float c2 = dot(c, c);
        // skip computation inside M1 - https://iquilezles.org/articles/mset1bulb
        if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
        // skip computation inside M2 - https://iquilezles.org/articles/mset2bulb
        if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;

        float di =  1.0;
        vec2 z  = vec2(0.0);
        float m2 = 0.0;
        vec2 dz = vec2(0.0);
        for( int i=0; i<300; i++ )
        {
            if( m2>1024.0 ) { di=0.0; break; }
            // Z' -> 2·Z·Z' + 1
            dz = 2.0*vec2(z.x*dz.x-z.y*dz.y, z.x*dz.y + z.y*dz.x) + vec2(1.0,0.0);
            // Z -> Z² + c
            z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
            m2 = dot(z,z);
        }

        // d(c) = |Z|·log|Z|/|Z'|
        float d = 0.5*sqrt(dot(z,z)/dot(dz,dz))*log(dot(z,z));
        if( di>0.5 ) d=0.0;
        return d;
    }

    void main()
    {
        vec2 uv = vPosition.xy / vPosition.w;
        uv.x *= resolution.x / resolution.y;

        float tz = 0.5 - 0.5*cos(0.05*time);
        float zoo = pow( 0.5, 16.0*tz );
        vec2 c = vec2(-0.5006,.520) + uv*zoo;

        float d = distanceToMandelbrot(c);
        d = clamp( pow(4.0*d/zoo,0.2), 0.0, 1.0 );

        vec3 col = mix(vec3(0.02, 0.02, 0.08), vec3(0.55, 0.85, 1.0), d);
        gl_FragColor = vec4( col, 1.0 );
    }
`;

// RIGHT — development. A `git log --graph` scrolling down: branches split off
// the main line, carry a few commits, then merge back. Drawn smooth and
// antialiased, so it scrolls fluidly.
export const fragmentShaderGitGraph = `
    ${common}

    vec3 laneColor(float i) {
        i = mod(i, 6.0);
        if (i < 1.0) return vec3(0.25, 0.85, 1.0);
        if (i < 2.0) return vec3(1.0, 0.35, 0.7);
        if (i < 3.0) return vec3(0.5, 1.0, 0.45);
        if (i < 4.0) return vec3(1.0, 0.8, 0.25);
        if (i < 5.0) return vec3(0.7, 0.5, 1.0);
        return vec3(1.0, 0.55, 0.3);
    }

    float sdSegment(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
    }


    // Is a branch alive on this lane at this row? Branches live for a few rows.
    float alive(float lane, float row) {
        if (lane == 4.0) return 1.0; // main line, always there
        float span = 6.0 + floor(hash(vec2(lane, 9.2)) * 6.0);
        float segment = floor((row + hash(vec2(lane, 3.1)) * 37.0) / span);
        return step(0.6, hash(vec2(lane, segment)));
    }

    void main() {
        vec2 p = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y); // y from the top

        float lanes = 9.0;
        float mainLane = 4.0;
        float laneW = resolution.x / lanes;
        float rowH = laneW * 0.85;
        float width = laneW * 0.07;
        float aa = 1.0;

        // Rows scroll down smoothly: newest commits appear at the top
        float y = p.y / rowH - time * 0.8;
        float row = floor(y);
        float fy = y - row;
        vec2 q = vec2(p.x, y * rowH);
        float xm = (mainLane + 0.5) * laneW;

        vec3 bg = vec3(0.02, 0.025, 0.06);
        vec3 col = bg;
        vec3 glow = vec3(0.0);

        // 1. Branch-off and merge connectors (diagonals to and from the main line)
        for (float j = 0.0; j < 9.0; j++) {
            if (j == mainLane) continue;
            float xj = (j + 0.5) * laneW;
            vec3 c = laneColor(j);
            for (float k = 0.0; k < 2.0; k++) {
                float s = row + k;            // branch starts at row s
                if (alive(j, s) > 0.5 && alive(j, s - 1.0) < 0.5) {
                    float d = sdSegment(q, vec2(xm, (s - 0.5) * rowH), vec2(xj, (s + 0.5) * rowH));
                    col = mix(col, c, smoothstep(width + aa, width - aa, d));
                    glow += c * exp(-d / (width * 3.0));
                }
                float e = row - k;            // branch ends at row e
                if (alive(j, e) > 0.5 && alive(j, e + 1.0) < 0.5) {
                    float d = sdSegment(q, vec2(xj, (e + 0.5) * rowH), vec2(xm, (e + 1.5) * rowH));
                    col = mix(col, c, smoothstep(width + aa, width - aa, d));
                    glow += c * exp(-d / (width * 3.0));
                }
            }
        }

        // 2. Vertical lines of living branches
        for (float j = 0.0; j < 9.0; j++) {
            if (alive(j, row) < 0.5) continue;
            float xj = (j + 0.5) * laneW;
            vec3 c = laneColor(j);
            float y0 = alive(j, row - 1.0) > 0.5 ? 0.0 : 0.5;
            float y1 = alive(j, row + 1.0) > 0.5 ? 1.0 : 0.5;
            float d = length(vec2(p.x - xj, (fy - clamp(fy, y0, y1)) * rowH));
            col = mix(col, c, smoothstep(width + aa, width - aa, d));
            glow += c * exp(-d / (width * 3.0));
        }

        // 3. Commits: rings. Always at a branch's first and last commit, and on
        //    the main line wherever a branch splits off or merges back.
        for (float j = 0.0; j < 9.0; j++) {
            if (alive(j, row) < 0.5) continue;
            bool edge = alive(j, row - 1.0) < 0.5 || alive(j, row + 1.0) < 0.5;
            if (j == mainLane) {
                for (float k = 0.0; k < 9.0; k++) {
                    if (k == mainLane) continue;
                    // a branch starts on the next row, or ended on the previous one
                    if (alive(k, row + 1.0) > 0.5 && alive(k, row) < 0.5) edge = true;
                    if (alive(k, row - 1.0) > 0.5 && alive(k, row) < 0.5) edge = true;
                }
            }
            if (!edge && hash(vec2(j, row)) < 0.35) continue;
            vec3 c = laneColor(j);
            float d = length(vec2(p.x - (j + 0.5) * laneW, (fy - 0.5) * rowH));
            float outer = width * 2.6;
            float inner = width * 1.3;
            col = mix(col, c, smoothstep(outer + aa, outer - aa, d));
            col = mix(col, bg, smoothstep(inner + aa, inner - aa, d));
            glow += c * exp(-max(d - outer, 0.0) / (width * 3.0)) * 0.6;
        }

        col += glow * 0.12;
        gl_FragColor = vec4(col, 1.0);
    }
`;

// BACK (from music) — a piano roll: notes scroll toward a pixel keyboard, and
// each key lights up while a note plays on it. Three tracks: bass, chords, melody.
export const fragmentShaderPianoRoll = `
    ${common}

    vec3 trackColor(float track) {
        if (track < 0.5) return vec3(1.0, 0.35, 0.6);   // bass
        if (track < 1.5) return vec3(1.0, 0.8, 0.3);    // chords
        return vec3(0.35, 0.85, 1.0);                   // melody
    }

    bool isBlack(float pitch) {
        float s = mod(pitch, 12.0);
        return s == 1.0 || s == 3.0 || s == 6.0 || s == 8.0 || s == 10.0;
    }

    // Returns the position inside the note covering (pitch, x), or -1.
    // Notes only sit on white keys (C major), lengths depend on the track.
    float noteAt(float pitch, float track, float x, float slotW) {
        if (isBlack(pitch)) return -1.0;
        float slot = floor(x / slotW);
        float fx = x / slotW - slot;
        float density = track < 0.5 ? 0.88 : (track < 1.5 ? 0.9 : 0.86);
        for (int i = 0; i < 6; i++) {
            float s = slot - float(i);
            if (hash(vec2(pitch, s)) > density) {
                float len = track < 0.5
                    ? 2.0 + floor(hash(vec2(s, pitch + 3.0)) * 4.0)
                    : 1.0 + floor(hash(vec2(s, pitch + 3.0)) * 3.0);
                if (float(i) < len) return (float(i) + fx) / len;
            }
        }
        return -1.0;
    }

    void main() {
        float px = max(2.0, floor(min(resolution.x, resolution.y) / 170.0));
        vec2 p = floor(gl_FragCoord.xy / px) * px + px * 0.5; // y from the bottom: pitch goes up

        float pitches = 25.0;
        float rowH = resolution.y / pitches;
        float pitch = floor(p.y / rowH);
        float fy = p.y / rowH - pitch;
        float track = pitch < 7.0 ? 0.0 : (pitch < 15.0 ? 1.0 : 2.0);

        float keyW = resolution.x * 0.07;
        float slotW = rowH * 1.1;
        float speed = slotW * 3.4;
        float playhead = time * speed;   // world x currently at the keyboard edge
        bool black = isBlack(pitch);

        vec3 col;
        if (p.x < keyW) {
            // Keyboard
            float playing = noteAt(pitch, track, playhead, slotW);
            if (black) {
                col = vec3(0.08, 0.07, 0.12);
                if (p.x > keyW * 0.62) col = vec3(0.16, 0.15, 0.22);
            } else {
                col = vec3(0.86, 0.86, 0.9);
            }
            if (playing >= 0.0) col = trackColor(track);
            if (fy < 0.07 || p.x > keyW - px * 1.5) col *= 0.55; // key separators
        } else {
            // Roll
            float x = p.x - keyW + playhead;
            col = black ? vec3(0.03, 0.025, 0.07) : vec3(0.05, 0.04, 0.1);
            if (mod(floor(x / slotW), 4.0) == 0.0 && fract(x / slotW) < 0.04) col += vec3(0.05, 0.05, 0.1); // beats
            if (mod(pitch, 12.0) == 0.0 && fy < 0.04) col += vec3(0.06, 0.04, 0.1);                     // octaves
            float n = noteAt(pitch, track, x, slotW);
            if (n >= 0.0 && fy > 0.14 && fy < 0.86) {
                vec3 c = trackColor(track);
                col = c * 0.85;
                if (fy > 0.7) col = c;                 // top highlight
                if (fy < 0.26) col = c * 0.55;         // bottom shade
            }
            if (p.x < keyW + px * 1.5) col = vec3(1.0); // playhead
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;

// LEFT — music. A chiptune tracker, FastTracker style: three channels (bass,
// lead, drums) of note / instrument / volume / effect, scrolling one row at a
// time, with the current row highlighted. Drawn with a tiny 3x5 bitmap font.
export const fragmentShaderTracker = `
    ${common}

    // 3x5 glyphs, 15 bits each (top row first). 0-9, A-F, G, #, -, .
    float glyphCode(float c) {
        if (c < 0.5) return 31599.0;
        if (c < 1.5) return 11415.0;
        if (c < 2.5) return 29671.0;
        if (c < 3.5) return 29647.0;
        if (c < 4.5) return 23497.0;
        if (c < 5.5) return 31183.0;
        if (c < 6.5) return 31215.0;
        if (c < 7.5) return 29257.0;
        if (c < 8.5) return 31727.0;
        if (c < 9.5) return 31695.0;
        if (c < 10.5) return 11245.0;
        if (c < 11.5) return 27566.0;
        if (c < 12.5) return 14627.0;
        if (c < 13.5) return 27502.0;
        if (c < 14.5) return 31143.0;
        if (c < 15.5) return 31140.0;
        if (c < 16.5) return 14699.0;
        if (c < 17.5) return 24445.0;
        if (c < 18.5) return 448.0;
        if (c < 19.5) return 2.0;
        return 0.0;
    }

    float glyphPixel(float c, vec2 g) {
        float bit = (4.0 - g.y) * 3.0 + (2.0 - g.x);
        return mod(floor(glyphCode(c) / pow(2.0, bit)), 2.0);
    }

    // Character shown at position pos (0-13) of a channel cell, or 20 = blank
    float cellChar(float ch, float row, float pos) {
        float h = hash12(vec2(ch * 17.0 + 1.0, row));
        float kind = mod(ch, 3.0); // channels cycle through bass, lead, drums
        bool note;
        if (kind < 0.5) note = mod(row, 4.0) == 0.0 && h > 0.15;        // bass on the beat
        else if (kind < 1.5) note = h > 0.5;                            // lead
        else note = mod(row, 2.0) == 0.0 && h > 0.25;                   // drums

        if (pos < 2.5) {
            if (!note) return 19.0;
            float n = floor(hash12(vec2(row, ch + 5.0)) * 7.0); // C D E F G A B
            float letter = n < 4.5 ? 12.0 + n : 10.0 + (n - 5.0);
            if (pos < 0.5) return letter;
            if (pos < 1.5) {
                bool sharp = hash12(vec2(row, ch + 9.0)) > 0.75 && letter != 14.0 && letter != 11.0;
                return sharp ? 17.0 : 18.0;
            }
            float octave = kind < 0.5 ? 2.0 : (kind > 1.5 ? 1.0 : 4.0 + step(0.5, hash12(vec2(row, ch + 2.0))));
            return octave;
        }
        if (pos == 3.0 || pos == 6.0 || pos == 9.0 || pos == 13.0) return 20.0;
        if (pos < 5.5) {                                  // instrument
            if (!note) return 19.0;
            return pos < 4.5 ? 0.0 : ch + 1.0;
        }
        if (pos < 8.5) {                                  // volume
            if (hash12(vec2(row, ch + 11.0)) < 0.5) return 19.0;
            return pos < 7.5 ? 2.0 + floor(hash12(vec2(row, ch + 12.0)) * 3.0)
                             : floor(hash12(vec2(row, ch + 13.0)) * 16.0);
        }
        if (hash12(vec2(row, ch + 14.0)) < 0.78) return 19.0; // effect
        if (pos < 10.5) return 10.0 + floor(hash12(vec2(row, ch + 15.0)) * 6.0);
        return floor(hash12(vec2(row, ch + pos)) * 16.0);
    }

    void main() {
        // About 72 characters across the face, whatever its size; channels repeat
        // until the right edge (the last one is cut off), no side margins.
        float px = max(1.0, floor(resolution.x / 288.0));
        float charsPerRow = floor(resolution.x / px / 4.0);
        float lineH = 8.0;   // in font pixels (5 + spacing)
        vec2 g = floor(vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / px);
        g.x -= 1.0;

        float visibleRows = floor(resolution.y / px / lineH);
        float midRow = floor(visibleRows * 0.5);
        float screenRow = floor(g.y / lineH);
        float current = floor(time * 6.0);       // rows per time unit
        float row = current + screenRow - midRow;

        vec3 col = vec3(0.03, 0.04, 0.12);
        if (mod(row, 4.0) == 0.0) col = vec3(0.05, 0.06, 0.17);
        if (screenRow == midRow) col = vec3(0.12, 0.16, 0.38);

        float c = floor(g.x / 4.0);
        vec2 local = vec2(mod(g.x, 4.0), mod(g.y, lineH) - 1.0);

        // Channel separators
        if (c >= 3.0 && mod(c - 3.0, 14.0) == 13.0 && local.x == 3.0) col = vec3(0.2, 0.25, 0.5);
        if (c == 2.0 && local.x == 2.0) col = vec3(0.2, 0.25, 0.5);

        if (g.x >= 0.0 && c < charsPerRow && local.x < 3.0 && local.y >= 0.0 && local.y < 5.0) {
            float ch = 20.0;
            vec3 ink = vec3(0.9);
            if (c < 2.0) {
                float n = mod(row, 64.0);
                ch = c < 0.5 ? floor(n / 16.0) : mod(n, 16.0);
                ink = mod(row, 4.0) == 0.0 ? vec3(1.0, 0.85, 0.35) : vec3(0.55, 0.6, 0.8);
            } else if (c >= 3.0) {
                float k = c - 3.0;
                float channel = floor(k / 14.0);
                float pos = mod(k, 14.0);
                ch = cellChar(channel, row, pos);
                if (pos < 2.5) ink = vec3(0.95, 0.95, 1.0);         // note
                else if (pos < 5.5) ink = vec3(0.35, 0.85, 1.0);    // instrument
                else if (pos < 8.5) ink = vec3(0.45, 1.0, 0.5);     // volume
                else ink = vec3(1.0, 0.6, 0.3);                      // effect
                if (ch == 19.0) ink = vec3(0.3, 0.33, 0.55);         // empty fields are dimmer
            }
            if (ch < 19.5 && glyphPixel(ch, local) > 0.5) col = ink;
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;
