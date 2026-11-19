import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const MODEL_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261115_071021_742152ba-5554-4270-9dc5-286bcff36a1a.glb';

/** Streams the GLB so progress reflects real bytes, then parses it. */
export async function loadModel(url, onProgress, signal) {
  const res = await fetch(url, { signal, mode: 'cors' });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(total ? Math.min(1, received / total) : Math.min(0.95, received / 1.5e6));
  }
  const buf = new Uint8Array(received);
  let o = 0;
  for (const c of chunks) { buf.set(c, o); o += c.length; }
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(buf.buffer, '', resolve, reject);
  });
}
