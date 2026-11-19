// Everything that needs three.js. Loaded on demand by Hero.jsx so it lands in its own chunk.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export { buildDots } from './buildDots.js';
export { createEngine } from './engine.js';

export function parseModel(buffer) {
  return new Promise((resolve, reject) => new GLTFLoader().parse(buffer, '', resolve, reject));
}
