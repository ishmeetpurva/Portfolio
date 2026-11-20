import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/** Parses the meshopt-compressed bust GLB. */
export function parseModel(buffer) {
  return new Promise((resolve, reject) => new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(buffer, '', resolve, reject));
}
