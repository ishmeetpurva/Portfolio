// Spec §7–8. Colours are passed in as uniforms (blue/silver remap).

export const bustVertex = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uSize;
uniform float uGlint;
uniform float uShine;
uniform vec2 uHead;
uniform vec3 uLight;
uniform vec3 uRingCenter;
uniform float uRingRadius;

attribute float aRand;
attribute vec2 aShade;
attribute float aPart;

varying float vB;
varying float vA;
varying float vShine;
varying float vGlint;
varying float vLens;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

void main() {
  // 1. Head turn
  float head = smoothstep(-1.3, -0.6, position.y);
  mat3 R = rotY(uHead.x * (0.25 + 0.75 * head)) * rotX(uHead.y * head);
  vec3 piv = vec3(0.0, -1.0, 0.0);
  vec3 home = R * (position - piv) + piv;
  vec3 n = normalize(R * normal);

  // 2. Breathing
  home += n * sin(uTime * 1.4 + aRand * 60.0) * 0.006;

  // 3. Entrance
  float r2 = fract(sin(aRand * 91.7) * 43758.5453);
  float t = clamp((uAssemble - aRand * 0.45) / 0.55, 0.0, 1.0);
  float e = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  float ang = aRand * 6.28318530718;
  float rr = uRingRadius * (1.0 + (r2 - 0.5) * 0.06);
  vec3 start = uRingCenter + vec3(sin(ang) * rr, cos(ang) * rr, 0.0);
  vec3 p = mix(start, home, e)
         + vec3(sin(aRand * 40.0 + uTime * 0.3), cos(aRand * 31.0), 0.9 + r2 * 1.4) * sin(e * 3.14159265) * 0.45;

  vec4 wp = modelMatrix * vec4(p, 1.0);

  // 4. Light terms
  vec3 toL = uLight - wp.xyz;
  float lit = max(dot(n, normalize(toL)), 0.0) / (1.0 + dot(toL, toL) * 0.32);
  float key = max(dot(n, normalize(vec3(-0.5, 0.6, 0.7))), 0.0);
  vec3 vn = normalize(normalMatrix * n);
  float facing = vn.z;
  float rim = pow(1.0 - abs(facing), 3.0);

  // 5. Brightness
  float b = 0.3 + key * 0.22 + lit * 1.5 + rim * 0.14;
  b *= mix(0.55, 1.0, smoothstep(-0.3, 0.25, facing));

  // 6. Depth
  float ridge = aShade.x;
  float thin = aShade.y;
  b *= ridge > 0.0 ? 1.0 + ridge * 0.7 : 1.0 + ridge * 0.5;
  b += thin * (0.26 + key * 0.3);

  // 7. Parts
  float isLeaf = step(1.5, aPart) * step(aPart, 2.5);
  float isVisor = step(2.5, aPart);
  float isLens = step(3.5, aPart);
  b *= mix(1.0, 0.9, isLeaf);
  b *= mix(1.0, 0.78, isVisor);
  b *= mix(1.0, 0.7, isLens);
  b *= 0.7 + r2 * 0.5;

  // 8. Glint (leaf + visor, on home x)
  float glint = (isLeaf + isVisor) * smoothstep(0.09, 0.0, abs(position.x - uGlint));
  b += glint * 1.2;

  // 9. Shine (turned home position)
  float band = home.y - home.x * 0.5 - uShine;
  float shine = exp(-band * band * 4.0);
  b += shine * 1.3;

  // 10–11. Alpha + size
  // Dots stay invisible on the start ring, so the loader's dotted circle is the only circle on screen.
  vA = mix(0.75, 1.0, e) * smoothstep(0.02, 0.2, e);
  vec4 mv = viewMatrix * wp;
  gl_PointSize = uSize * (0.45 + r2 * r2 * 1.3) * (1.0 + shine * 0.6) / -mv.z;
  gl_Position = projectionMatrix * mv;

  vB = b;
  vShine = shine;
  vGlint = glint;
  vLens = isLens;
}
`;

export const bustFragment = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uBlue;
uniform vec3 uCream;
varying float vB;
varying float vA;
varying float vShine;
varying float vGlint;
varying float vLens;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = exp(-16.0 * r * r) * vA;
  vec3 ink = mix(uInk, uCream, vShine * 0.6);
  ink = mix(ink, uBlue, 0.6 * vLens);
  ink = mix(ink, uBlue, vGlint * 0.7);
  vec3 col = ink * vB * a;
  // premultiplied output so dots add light over the CSS water gradient
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
}
`;

export const lightVertex = /* glsl */ `
uniform float uOn;
uniform float uSize;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * uOn / -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const lightFragment = /* glsl */ `
uniform float uOn;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float core = smoothstep(0.14, 0.08, r);
  float glow = exp(-4.0 * r) * 0.45 + exp(-12.0 * r) * 0.7;
  vec3 col = (vec3(1.0) * core + vec3(0.86, 0.93, 1.0) * glow) * uOn;
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
}
`;

export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uOn;
attribute float aRand;
varying float vB;
void main() {
  vec3 p = position;
  p.y = mod(p.y + 6.0 + uTime * (0.03 + aRand * 0.05), 12.0) - 6.0;
  p.x += sin(uTime * 0.2 + aRand * 40.0) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.5 + aRand) / -mv.z;
  gl_Position = projectionMatrix * mv;
  vB = (0.1 + aRand * 0.18) * uOn;
}
`;

export const dustFragment = /* glsl */ `
uniform vec3 uInk;
varying float vB;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = exp(-16.0 * r * r);
  vec3 col = uInk * vB * a;
  gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
}
`;
