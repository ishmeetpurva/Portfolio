import { Mesh, Vector3 } from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export const TOTAL_DOTS = 66000;
const CANDIDATES = TOTAL_DOTS * 5;
const PART = { BUST: 1, LEAF: 2, FRAME: 3, LENS: 4 };

const rand = Math.random;
const jit = (a = 0.0015) => (rand() * 2 - 1) * a;

/**
 * Turns the bust mesh into 66,000 dots (spec §6).
 * Returns typed arrays ready for a BufferGeometry, plus glint bounds.
 */
export function buildDots(gltf) {
  let mesh = null;
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => { if (!mesh && o.isMesh) mesh = o; });
  if (!mesh) throw new Error('No mesh in model');

  const geom = mesh.geometry.clone();
  geom.applyMatrix4(mesh.matrixWorld);
  if (!geom.attributes.normal) geom.computeVertexNormals();
  const sampler = new MeshSurfaceSampler(new Mesh(geom)).build();

  // ── Candidates ───────────────────────────────────────────
  const cP = new Float32Array(CANDIDATES * 3);
  const cN = new Float32Array(CANDIDATES * 3);
  const p = new Vector3();
  const n = new Vector3();
  for (let i = 0; i < CANDIDATES; i++) {
    sampler.sample(p, n);
    n.normalize();
    cP[i * 3] = p.x; cP[i * 3 + 1] = p.y; cP[i * 3 + 2] = p.z;
    cN[i * 3] = n.x; cN[i * 3 + 1] = n.y; cN[i * 3 + 2] = n.z;
  }

  // ── Visor (parts 3 + 4) ──────────────────────────────────
  const visor = buildVisor(cP, cN);

  // ── Open hair (replaces the model's bun) ─────────────────
  // Drop every candidate above the crown, then grow loose strands from a scalp dome.
  const keep = [];
  for (let i = 0; i < CANDIDATES; i++) if (cP[i * 3 + 1] <= HAIR.cutY) keep.push(i);
  const kP = new Float32Array(keep.length * 3);
  const kN = new Float32Array(keep.length * 3);
  keep.forEach((c, j) => { kP.set(cP.subarray(c * 3, c * 3 + 3), j * 3); kN.set(cN.subarray(c * 3, c * 3 + 3), j * 3); });
  const hair = buildHair(HAIR.dots);

  // ── Even density bust dots (part 1) ──────────────────────
  const need = TOTAL_DOTS - visor.count - hair.count;
  const bustIdx = voxelThin(kP, need);

  // ── Assemble final arrays (model units first) ────────────
  const N = TOTAL_DOTS;
  const mPos = new Float32Array(N * 3);
  const nor = new Float32Array(N * 3);
  const part = new Float32Array(N);
  let k = 0;
  for (let i = 0; i < visor.count; i++, k++) {
    mPos.set(visor.pos.subarray(i * 3, i * 3 + 3), k * 3);
    nor.set(visor.nor.subarray(i * 3, i * 3 + 3), k * 3);
    part[k] = visor.part[i];
  }
  for (let j = 0; j < bustIdx.length; j++, k++) {
    const c = bustIdx[j];
    mPos[k * 3] = kP[c * 3]; mPos[k * 3 + 1] = kP[c * 3 + 1]; mPos[k * 3 + 2] = kP[c * 3 + 2];
    nor[k * 3] = kN[c * 3]; nor[k * 3 + 1] = kN[c * 3 + 1]; nor[k * 3 + 2] = kN[c * 3 + 2];
    part[k] = PART.BUST;
  }
  const hairStart = k;
  for (let i = 0; i < hair.count; i++, k++) {
    mPos.set(hair.pos.subarray(i * 3, i * 3 + 3), k * 3);
    nor.set(hair.nor.subarray(i * 3, i * 3 + 3), k * 3);
    part[k] = PART.BUST;
  }

  const shade = computeShade(mPos, nor, kP, N);
  // Strands have no mesh around them: give them a soft, slightly bright shade instead.
  for (let i = hairStart; i < N; i++) { shade[i * 2] = 0.05 + 0.3 * rand(); shade[i * 2 + 1] = 0.22 + 0.2 * rand(); }

  // ── World placement, randoms, glint bounds ───────────────
  const pos = new Float32Array(N * 3);
  const aRand = new Float32Array(N);
  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < N; i++) {
    const x = mPos[i * 3] * 2.8;
    pos[i * 3] = x;
    pos[i * 3 + 1] = mPos[i * 3 + 1] * 2.8 - 0.55; // sits a little higher now the bun is gone
    pos[i * 3 + 2] = mPos[i * 3 + 2] * 2.8;
    aRand[i] = rand();
    if (part[i] > 1.5) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  }
  if (!isFinite(minX)) { minX = -0.6; maxX = 0.6; }

  return { count: N, position: pos, normal: nor, aRand, aShade: shade, aPart: part, glintMin: minX, glintMax: maxX };
}

// ─────────────────────────────────────────────────────────────
// Scalp dome fitted to the model's head (model units; +z is the face).
const HAIR = { cutY: 0.62, dots: 17000, c: [0, 0.5, -0.01], r: [0.315, 0.27, 0.41] };

function buildHair(total) {
  const [cx, cy, cz] = HAIR.c, [rx, ry, rz] = HAIR.r;
  const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3);
  const LOCKS = 64, PER = 5;
  const perStrand = Math.ceil(total / (LOCKS * PER));
  const smooth = (t) => t * t * (3 - 2 * t);
  let k = 0;

  for (let l = 0; l < LOCKS && k < total; l++) {
    // Lock root: spread all round the head; a centre parting sends front locks to the sides.
    const side = l % 2 ? 1 : -1;
    const th0 = side * (0.12 + (Math.PI - 0.12) * ((l >> 1) + rand() * 0.8) / (LOCKS / 2));
    const front = Math.cos(th0);                        // 1 = forehead, -1 = back
    const thEnd = front > 0.2 ? side * (1.25 + 0.35 * rand() + (1 - front) * 0.4) : th0 + side * 0.15 * rand();
    const a0 = 0.05 + rand() * 0.35;                     // root distance from the crown
    const tipY = (front > 0.2 ? -0.18 : -0.42) - rand() * 0.16;
    const wave = 0.018 + rand() * 0.026, freq = 6 + rand() * 6, ph = rand() * 6.28;
    const flare = 0.08 + rand() * 0.1;

    for (let s = 0; s < PER && k < total; s++) {
      const dth = (rand() - 0.5) * 0.12, da = (rand() - 0.5) * 0.08, sp = 1.03 + rand() * 0.04;
      const sph = ph + rand() * 0.8;
      const point = (t) => {
        // t ∈ [0, 0.32]: over the dome, crown → ear level. t ∈ (0.32, 1]: falling loose.
        if (t <= 0.32) {
          const u = t / 0.32;
          const a = a0 + da + (Math.PI / 2 - a0) * u;
          const th = th0 + dth + (thEnd - th0) * smooth(u);
          const sx = Math.sin(a) * Math.sin(th), sy = Math.cos(a), sz = Math.sin(a) * Math.cos(th);
          const g = sp * (1 + 0.1 * smooth(u));
          return [cx + rx * g * sx, cy + ry * g * sy, cz + rz * g * sz, sx, sy * 0.6, sz];
        }
        const u = (t - 0.32) / 0.68;
        const th = thEnd + dth;
        const g = sp * 1.1 + flare * smooth(u) + 0.04 * Math.max(0, (0.1 - (cy - (cy - tipY) * u)) * 2);
        const w = Math.sin(u * freq + sph) * wave * smooth(Math.min(1, u * 3));
        const bx = Math.sin(th), bz = Math.cos(th);
        const x = cx + rx * g * bx + bz * w, z = cz + rz * g * bz - bx * w;
        return [x, cy - (cy - tipY) * u, z, bx, 0.05, bz];
      };
      for (let i = 0; i < perStrand && k < total; i++, k++) {
        const t = Math.pow(rand(), 0.85);
        const [x, y, z, nx, ny, nz] = point(t);
        const l2 = Math.hypot(nx, ny, nz) || 1;
        pos[k * 3] = x + jit(0.004); pos[k * 3 + 1] = y + jit(0.004); pos[k * 3 + 2] = z + jit(0.004);
        nor[k * 3] = nx / l2; nor[k * 3 + 1] = ny / l2; nor[k * 3 + 2] = nz / l2;
      }
    }
  }
  return { count: k, pos: pos.subarray(0, k * 3), nor: nor.subarray(0, k * 3) };
}

// ─────────────────────────────────────────────────────────────
function voxelThin(cP, need) {
  const V = 0.022;
  const n = cP.length / 3;
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = cP[i * 3], y = cP[i * 3 + 1], z = cP[i * 3 + 2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  const NX = Math.floor((maxX - minX) / V) + 1;
  const NY = Math.floor((maxY - minY) / V) + 1;
  const NZ = Math.floor((maxZ - minZ) / V) + 1;
  const vox = new Int32Array(n);
  const counts = new Int32Array(NX * NY * NZ);
  for (let i = 0; i < n; i++) {
    const ix = Math.floor((cP[i * 3] - minX) / V);
    const iy = Math.floor((cP[i * 3 + 1] - minY) / V);
    const iz = Math.floor((cP[i * 3 + 2] - minZ) / V);
    const v = ix + NX * (iy + NY * iz);
    vox[i] = v;
    counts[v]++;
  }
  const target = 1.8 * need;
  let maxC = 0;
  for (let v = 0; v < counts.length; v++) if (counts[v] > maxC) maxC = counts[v];
  const sumCap = (cap) => { let s = 0; for (let v = 0; v < counts.length; v++) s += Math.min(counts[v], cap); return s; };
  let lo = 1, hi = maxC;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (sumCap(mid) >= target) hi = mid; else lo = mid + 1; }
  const cap = lo;

  const used = new Int32Array(counts.length);
  const pool = [];
  for (let i = 0; i < n; i++) { const v = vox[i]; if (used[v] < cap) { used[v]++; pool.push(i); } }
  for (let i = pool.length - 1; i > 0; i--) { const j = (rand() * (i + 1)) | 0; const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
  if (pool.length < need) {
    // Extremely unlikely; top up with random candidates.
    while (pool.length < need) pool.push((rand() * n) | 0);
  }
  return pool.slice(0, need);
}

// ─────────────────────────────────────────────────────────────
function buildVisor(cP, cN) {
  const CELL = 0.01, X0 = -0.32, X1 = 0.32, Y0 = 0.2, Y1 = 0.45;
  const GX = Math.round((X1 - X0) / CELL), GY = Math.round((Y1 - Y0) / CELL);
  const hm = new Float32Array(GX * GY).fill(-Infinity);
  const n = cP.length / 3;
  for (let i = 0; i < n; i++) {
    if (cN[i * 3 + 2] < 0.2) continue;
    const x = cP[i * 3], y = cP[i * 3 + 1], z = cP[i * 3 + 2];
    if (x < X0 || x > X1 || y < Y0 || y > Y1) continue;
    const gx = Math.min(GX - 1, Math.floor((x - X0) / CELL));
    const gy = Math.min(GY - 1, Math.floor((y - Y0) / CELL));
    const c = gx + gy * GX;
    if (z > hm[c]) hm[c] = z;
  }
  const face = (x, y) => {
    const gx = Math.floor((x - X0) / CELL), gy = Math.floor((y - Y0) / CELL);
    let m = -Infinity;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const a = gx + dx, b = gy + dy;
      if (a < 0 || b < 0 || a >= GX || b >= GY) continue;
      const v = hm[a + b * GX];
      if (v > m) m = v;
    }
    return m;
  };

  const W = 0.215, CL = 0.028;
  const top = (x) => 0.378 - 0.022 * (x / W) ** 2;
  const low = (x) => 0.282 + 0.032 * Math.exp(-((x / 0.034) ** 2)) + 0.026 * (x / W) ** 4;

  let front = -Infinity;
  for (let x = -0.06; x <= 0.0601; x += 0.01) for (let y = 0.3; y <= 0.3601; y += 0.01) front = Math.max(front, face(x, y));
  front += CL;

  let wrap = Infinity;
  for (let x = -W; x <= W + 1e-6; x += 0.01) {
    if (Math.abs(x) < 0.05) continue;
    let needZ = -Infinity;
    for (let y = low(x); y <= top(x) + 1e-6; y += 0.005) needZ = Math.max(needZ, face(x, y));
    if (!isFinite(needZ)) continue;
    wrap = Math.min(wrap, (front - needZ - 0.7 * CL) / (x * x));
  }
  if (!isFinite(front) || !isFinite(wrap) || wrap <= 0) { wrap = 2.4; if (!isFinite(front)) front = 0.42; }
  const lensZ = (x) => front - wrap * x * x;

  const pos = [], nor = [], part = [];
  const push = (x, y, z, nx, ny, nz, pt) => {
    const l = Math.hypot(nx, ny, nz) || 1;
    pos.push(x + jit(), y + jit(), z + jit());
    nor.push(nx / l, ny / l, nz / l);
    part.push(pt);
  };
  const lensN = (x) => [2 * wrap * x, 0, 1];

  for (let i = 0; i < 950; i++) {
    const x = -W + rand() * 2 * W;
    const y = top(x) - 0.016 * rand() * rand();
    push(x, y, lensZ(x) + 0.004, ...lensN(x), PART.FRAME);
  }
  for (let i = 0; i < 380; i++) {
    const x = -W + rand() * 2 * W;
    push(x, low(x), lensZ(x) + 0.002, ...lensN(x), PART.FRAME);
  }
  for (const s of [-1, 1]) {
    const x = s * W;
    for (let i = 0; i < 70; i++) {
      const y = low(x) + rand() * (top(x) - low(x));
      push(x, y, lensZ(x), ...lensN(x), PART.FRAME);
    }
  }
  for (let i = 0; i < 1500; i++) {
    const x = -W + rand() * 2 * W;
    const y = low(x) + rand() * Math.max(0, top(x) - low(x));
    push(x, y, lensZ(x), ...lensN(x), PART.LENS);
  }
  for (const s of [-1, 1]) {
    for (let i = 0; i < 70; i++) {
      const t = rand();
      push(s * (W + 0.03 * t), top(s * W) - 0.008, lensZ(W) - 0.15 * t, s, 0, 0.15, PART.FRAME);
    }
  }
  return { count: part.length, pos: new Float32Array(pos), nor: new Float32Array(nor), part: new Float32Array(part) };
}

// ─────────────────────────────────────────────────────────────
function computeShade(mPos, nor, cP, N) {
  const R = 0.03;
  const half = Math.floor(cP.length / 3 / 2);
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < half; i++) {
    const x = cP[i * 3], y = cP[i * 3 + 1], z = cP[i * 3 + 2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  minX -= R; minY -= R; minZ -= R;
  const NX = Math.floor((maxX + R - minX) / R) + 1;
  const NY = Math.floor((maxY + R - minY) / R) + 1;
  const NZ = Math.floor((maxZ + R - minZ) / R) + 1;
  const cellOf = (x, y, z) => {
    const ix = Math.floor((x - minX) / R), iy = Math.floor((y - minY) / R), iz = Math.floor((z - minZ) / R);
    if (ix < 0 || iy < 0 || iz < 0 || ix >= NX || iy >= NY || iz >= NZ) return -1;
    return ix + NX * (iy + NY * iz);
  };
  const start = new Int32Array(NX * NY * NZ + 1);
  const cell = new Int32Array(half);
  for (let i = 0; i < half; i++) { const c = cellOf(cP[i * 3], cP[i * 3 + 1], cP[i * 3 + 2]); cell[i] = c; start[c + 1]++; }
  for (let c = 0; c < NX * NY * NZ; c++) start[c + 1] += start[c];
  const fill = start.slice();
  const items = new Int32Array(half);
  for (let i = 0; i < half; i++) items[fill[cell[i]]++] = i;

  const ridge = new Float32Array(N);
  const cnt = new Float32Array(N);
  const R2 = R * R;
  for (let d = 0; d < N; d++) {
    const px = mPos[d * 3], py = mPos[d * 3 + 1], pz = mPos[d * 3 + 2];
    const ix = Math.floor((px - minX) / R), iy = Math.floor((py - minY) / R), iz = Math.floor((pz - minZ) / R);
    let sx = 0, sy = 0, sz = 0, c = 0;
    for (let dz = -1; dz <= 1; dz++) {
      const z = iz + dz; if (z < 0 || z >= NZ) continue;
      for (let dy = -1; dy <= 1; dy++) {
        const y = iy + dy; if (y < 0 || y >= NY) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const x = ix + dx; if (x < 0 || x >= NX) continue;
          const cc = x + NX * (y + NY * z);
          for (let s = start[cc], e = start[cc + 1]; s < e; s++) {
            const j = items[s] * 3;
            const ox = cP[j] - px, oy = cP[j + 1] - py, oz = cP[j + 2] - pz;
            if (ox * ox + oy * oy + oz * oz <= R2) { sx += ox; sy += oy; sz += oz; c++; }
          }
        }
      }
    }
    cnt[d] = c;
    if (c > 0) ridge[d] = -((sx / c) * nor[d * 3] + (sy / c) * nor[d * 3 + 1] + (sz / c) * nor[d * 3 + 2]) / R;
  }
  const abs = Float32Array.from(ridge, Math.abs).sort();
  const p90 = abs[Math.floor(abs.length * 0.9)] || 1;
  const sortedCnt = cnt.slice().sort();
  const median = sortedCnt[Math.floor(N / 2)] || 1;
  const out = new Float32Array(N * 2);
  for (let d = 0; d < N; d++) {
    out[d * 2] = Math.max(-1, Math.min(1, ridge[d] / p90));
    out[d * 2 + 1] = Math.max(0, Math.min(1, 1 - cnt[d] / (0.55 * median)));
  }
  return out;
}
