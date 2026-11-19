import {
  BufferAttribute, BufferGeometry, Color, CustomBlending, OneFactor, AddEquation,
  PerspectiveCamera, Plane, Points, Raycaster, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { bustVertex, bustFragment, lightVertex, lightFragment, dustVertex, dustFragment } from './shaders.js';

// Blue / silver remap of the spec colours
export const COLORS = {
  ink: '#c9d6e4', // bust + dust dots (spec: moss #c9d4b8)
  blue: '#5fb4f0', // glint + lens (spec: sage #7fa8a3)
  cream: '#f2f5f9', // shine target (spec: cream #f0e5c8)
};

const TAN15 = Math.tan((15 * Math.PI) / 180);
const TARGET = new Vector3(0, -0.15, 0);

const additive = (m) => {
  m.transparent = true;
  m.depthWrite = false;
  m.blending = CustomBlending;
  m.blendEquation = AddEquation;
  m.blendSrc = OneFactor; m.blendDst = OneFactor;
  m.blendSrcAlpha = OneFactor; m.blendDstAlpha = OneFactor;
  return m;
};
const ease = (dt, rate) => 1 - Math.exp(-dt * rate);

/**
 * Creates the hero renderer. `dots` comes from buildDots().
 * Calls onReady() once uAssemble passes 0.55.
 */
export function createEngine({ stage, host, dots, reduced, onReady }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance', alpha: true });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);

  // ── Bust ────────────────────────────────────────────────
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(dots.position, 3));
  g.setAttribute('normal', new BufferAttribute(dots.normal, 3));
  g.setAttribute('aRand', new BufferAttribute(dots.aRand, 1));
  g.setAttribute('aShade', new BufferAttribute(dots.aShade, 2));
  g.setAttribute('aPart', new BufferAttribute(dots.aPart, 1));
  const bustU = {
    uTime: { value: 0 },
    uAssemble: { value: reduced ? 1 : 0 },
    uSize: { value: 26 * dpr },
    uGlint: { value: -9 },
    uShine: { value: 99 },
    uHead: { value: new Vector2() },
    uLight: { value: new Vector3(-1.4, 1.2, 1.6) },
    uRingCenter: { value: TARGET.clone() },
    uRingRadius: { value: 1 },
    uInk: { value: new Color(COLORS.ink) },
    uBlue: { value: new Color(COLORS.blue) },
    uCream: { value: new Color(COLORS.cream) },
  };
  const bust = new Points(g, additive(new ShaderMaterial({ uniforms: bustU, vertexShader: bustVertex, fragmentShader: bustFragment })));
  bust.frustumCulled = false;
  scene.add(bust);

  // ── Cursor light ────────────────────────────────────────
  const lg = new BufferGeometry();
  lg.setAttribute('position', new BufferAttribute(new Float32Array(3), 3));
  const lightU = { uOn: { value: reduced ? 1 : 0 }, uSize: { value: 240 * dpr } };
  const light = new Points(lg, additive(new ShaderMaterial({ uniforms: lightU, vertexShader: lightVertex, fragmentShader: lightFragment })));
  light.frustumCulled = false;
  light.position.copy(bustU.uLight.value);
  scene.add(light);

  // ── Dust ────────────────────────────────────────────────
  const DUST = 900;
  const dp = new Float32Array(DUST * 3);
  const dr = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dp[i * 3] = -9 + Math.random() * 18;
    dp[i * 3 + 1] = -6 + Math.random() * 12;
    dp[i * 3 + 2] = -6 + Math.random() * 8;
    dr[i] = Math.random();
  }
  const dg = new BufferGeometry();
  dg.setAttribute('position', new BufferAttribute(dp, 3));
  dg.setAttribute('aRand', new BufferAttribute(dr, 1));
  const dustU = { uTime: { value: 0 }, uSize: { value: 22 * dpr }, uOn: { value: reduced ? 1 : 0 }, uInk: { value: new Color(COLORS.ink) } };
  const dust = new Points(dg, additive(new ShaderMaterial({ uniforms: dustU, vertexShader: dustVertex, fragmentShader: dustFragment })));
  dust.frustumCulled = false;
  scene.add(dust);

  // ── Resize / camera fit ─────────────────────────────────
  const resize = () => {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = Math.max(2.35 / TAN15, 1.7 / (TAN15 * camera.aspect));
    camera.position.set(0, -0.15, dist);
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
    const px = (2 * dist * TAN15) / h;
    bustU.uRingRadius.value = 92 * px;
    bustU.uRingCenter.value.copy(TARGET);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  // ── Pointer ─────────────────────────────────────────────
  const ray = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), -2.6); // z = 2.6
  const ndc = new Vector2();
  const hit = new Vector3();
  let pointerActive = false;
  let touchTimer = 0;
  const lightTarget = bustU.uLight.value.clone();
  const headTarget = new Vector2();
  const head = new Vector2();

  const onMove = (e) => {
    const r = stage.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) lightTarget.copy(hit);
    headTarget.set(0.5 * ndc.x, 0.18 * ndc.y);
    pointerActive = true;
    clearTimeout(touchTimer);
    if (e.pointerType === 'touch') touchTimer = setTimeout(() => { pointerActive = false; }, 1500);
  };
  const onLeave = () => { pointerActive = false; };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onMove);
  host.addEventListener('pointerleave', onLeave);

  // ── Loop ────────────────────────────────────────────────
  let t = 0;
  let last = performance.now();
  let raf = 0;
  let running = false;
  let readyFired = false;
  const lightPos = bustU.uLight.value;

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    // Assemble
    const A = reduced ? 1 : Math.min(1, t / 2.6);
    bustU.uAssemble.value = A;
    if (!readyFired && A > 0.55) { readyFired = true; onReady(); }

    // Fades
    if (!reduced) {
      lightU.uOn.value += (Math.min(1, 1.6 * A) - lightU.uOn.value) * ease(dt, 4);
      dustU.uOn.value += (1 - dustU.uOn.value) * ease(dt, 0.8);
    }

    // Time
    const time = reduced ? 0 : t;
    bustU.uTime.value = time;
    dustU.uTime.value = time;

    // Shine (once)
    if (!reduced && t >= 2.34 && t <= 4.54) {
      const s = (t - 2.34) / 2.2;
      bustU.uShine.value = 2.8 - (1 - (1 - s) ** 2) * 7.4;
    } else bustU.uShine.value = 99;

    // Glint (every 4.2 s from 4.6 s)
    if (!reduced && t >= 4.6) {
      const local = (t - 4.6) % 4.2;
      if (local < 0.9) {
        const a = dots.glintMin - 0.15, b = dots.glintMax + 0.15;
        bustU.uGlint.value = a + (local / 0.9) * (b - a);
      } else bustU.uGlint.value = -9;
    }

    // Light + head
    if (pointerActive) {
      if (reduced) lightPos.copy(lightTarget);
      else {
        lightPos.lerp(lightTarget, ease(dt, 5));
        head.lerp(headTarget, ease(dt, 3));
      }
    } else if (!reduced) {
      lightTarget.set(1.9 * Math.sin(0.45 * t), 0.5 + 0.8 * Math.cos(0.33 * t), 2.6);
      lightPos.lerp(lightTarget, ease(dt, 5));
      headTarget.set(0.35 * Math.sin(0.45 * t), 0.12 * Math.cos(0.33 * t));
      head.lerp(headTarget, ease(dt, 1.5));
    }
    bustU.uHead.value.set(head.x, -head.y);
    light.position.copy(lightPos);

    renderer.render(scene, camera);
  };

  const start = () => { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  // Pause when the hero is off-screen
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
  io.observe(stage);
  start();

  return {
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(touchTimer);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onMove);
      host.removeEventListener('pointerleave', onLeave);
      [g, lg, dg].forEach((x) => x.dispose());
      [bust, light, dust].forEach((x) => x.material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
