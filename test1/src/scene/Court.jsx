import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural badminton court — green surface + white line markings drawn in a shader,
// with a subtle sheen and a radial fade to black so it dissolves into the void.
// Court coordinates are in metres (plane is sized to a real doubles court).

const vertex = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 fragColor;

  uniform vec3 uCourt;
  uniform vec3 uLine;
  uniform float uTime;
  uniform vec2 uSize;

  // soft "is v within [lo,hi]" with antialiasing
  float between(float v, float lo, float hi) {
    float aa = fwidth(v);
    return smoothstep(lo - aa, lo + aa, v) * (1.0 - smoothstep(hi - aa, hi + aa, v));
  }
  // line at x == xt, running over y in [ylo,yhi]
  float vline(float X, float Y, float xt, float ylo, float yhi, float hw) {
    float aa = fwidth(X);
    float l = 1.0 - smoothstep(hw, hw + aa, abs(X - xt));
    return l * between(Y, ylo, yhi);
  }
  // line at y == yt, running over x in [xlo,xhi]
  float hline(float X, float Y, float yt, float xlo, float xhi, float hw) {
    float aa = fwidth(Y);
    float l = 1.0 - smoothstep(hw, hw + aa, abs(Y - yt));
    return l * between(X, xlo, xhi);
  }

  void main() {
    float X = (vUv.x - 0.5) * uSize.x;   // metres across (±3.05 = doubles sideline)
    float Y = (vUv.y - 0.5) * uSize.y;   // metres along  (±6.7  = back boundary)
    float hw = 0.03;                      // ~6cm lines

    float L = 0.0;
    // sidelines (doubles + singles)
    L = max(L, vline(X, Y,  3.05, -6.70, 6.70, hw));
    L = max(L, vline(X, Y, -3.05, -6.70, 6.70, hw));
    L = max(L, vline(X, Y,  2.59, -6.70, 6.70, hw));
    L = max(L, vline(X, Y, -2.59, -6.70, 6.70, hw));
    // baselines + service lines
    L = max(L, hline(X, Y,  6.70, -3.05, 3.05, hw));
    L = max(L, hline(X, Y, -6.70, -3.05, 3.05, hw));
    L = max(L, hline(X, Y,  1.98, -3.05, 3.05, hw));  // short service
    L = max(L, hline(X, Y, -1.98, -3.05, 3.05, hw));
    L = max(L, hline(X, Y,  5.94, -3.05, 3.05, hw));  // doubles long service
    L = max(L, hline(X, Y, -5.94, -3.05, 3.05, hw));
    // centre line (only in the service courts)
    L = max(L, vline(X, Y, 0.0,  1.98, 6.70, hw));
    L = max(L, vline(X, Y, 0.0, -6.70, -1.98, hw));

    // base green with a faint moving sheen so it isn't dead-flat
    vec3 court = uCourt;
    court += 0.05 * sin(X * 0.5 + Y * 0.25 + uTime * 0.35);
    court *= 0.9 + 0.1 * smoothstep(2.5, 0.0, length(vec2(X, Y))); // soft centre lift

    vec3 col = mix(court, uLine, L);

    // elliptical fade to black at the edges
    float r = length(vec2(X / 3.5, Y / 4.8));
    col *= 1.0 - smoothstep(0.62, 1.0, r);

    fragColor = vec4(col, 1.0);
  }
`

export default function Court() {
  const mat = useRef()

  const uniforms = useMemo(
    () => ({
      uCourt: { value: new THREE.Color('#0d5b3e') },
      uLine: { value: new THREE.Color('#eef2ea') },
      uTime: { value: 0 },
      uSize: { value: new THREE.Vector2(6.1, 13.4) },
    }),
    []
  )

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[6.1, 13.4, 1, 1]} />
      <shaderMaterial
        ref={mat}
        args={[{ uniforms, vertexShader: vertex, fragmentShader: fragment, glslVersion: THREE.GLSL3 }]}
      />
    </mesh>
  )
}
