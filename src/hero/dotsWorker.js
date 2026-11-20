// Parses the GLB and builds the 66k dots off the main thread (≈0.25 s of work, ~0.9 s on slow phones).
import { parseModel } from './parseModel.js';
import { buildDots } from './buildDots.js';

self.onmessage = async ({ data: buffer }) => {
  try {
    const d = buildDots(await parseModel(buffer));
    self.postMessage({ dots: d }, [d.position.buffer, d.normal.buffer, d.aRand.buffer, d.aShade.buffer, d.aPart.buffer]);
  } catch (e) {
    self.postMessage({ error: String(e) });
  }
};
