import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { progress, fx, SX } from '../store.js'
import SportCourt from './SportCourt.jsx'
import { TableTennisPaddle, BadmintonRacket, PickleballPaddle } from './paddles.jsx'
import Atmosphere from './Atmosphere.jsx'

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const smooth = (t) => t * t * (3 - 2 * t)
const seg = (o, a, b) => smooth(clamp((o - a) / (b - a)))
const lerp = (a, b, t) => a + (b - a) * t

// Camera pans side-to-side across the three stations, then pulls back to show all three.
function sceneCam(o) {
  let x, y = 1.7, z = 6.4, ly = 1.15
  if (o < 0.14) x = SX.tt
  else if (o < 0.24) x = lerp(SX.tt, SX.bad, seg(o, 0.14, 0.24))
  else if (o < 0.36) x = SX.bad
  else if (o < 0.46) x = lerp(SX.bad, SX.pick, seg(o, 0.36, 0.46))
  else if (o < 0.58) x = SX.pick
  else {
    const t = seg(o, 0.58, 0.7)
    x = lerp(SX.pick, 0, t); z = lerp(6.4, 22, t); y = lerp(1.7, 5.5, t); ly = lerp(1.15, 1.7, t)
  }
  return [[x, y, z], [x, ly, 0]]
}

export default function Experience() {
  const scroll = useScroll()
  const { camera } = useThree()
  const _pos = useRef(new THREE.Vector3())
  const _look = useRef(new THREE.Vector3())
  const last = useRef(0)

  useFrame((state, delta) => {
    const o = scroll.offset
    progress.v = o
    // smoothed scroll velocity -> drives the pixel/RGB "stretch"
    const dv = Math.abs(o - last.current); last.current = o
    progress.vel = lerp(progress.vel, dv, 0.25)
    if (fx.pixel && 'granularity' in fx.pixel) fx.pixel.granularity = clamp(progress.vel * 900, 0, 14)
    if (fx.ca) {
      const x = clamp(progress.vel * 55, 0, 0.012)
      const off = fx.ca.offset
      if (off?.set) off.set(x, 0)
      else if (off?.value?.set) off.value.set(x, 0)
    }

    const [p, l] = sceneCam(o)
    const k = Math.min(1, delta * 6)
    _pos.current.set(p[0] + Math.sin(state.clock.elapsedTime * 0.4) * 0.04, p[1], p[2])
    camera.position.lerp(_pos.current, k)
    _look.current.lerp({ x: l[0], y: l[1], z: l[2] }, k)
    camera.lookAt(_look.current)
  })

  return (
    <>
      <Environment resolution={256} background={false}>
        <Lightformer intensity={1.6} position={[0, 4, 4]} scale={[10, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-6, 1, 2]} scale={[4, 4, 1]} color="#bfe9d4" />
        <Lightformer intensity={1.0} position={[6, 1, 2]} scale={[4, 4, 1]} color="#bcd4ff" />
      </Environment>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={1.0} />

      <Atmosphere />

      {/* Station 1 — Table Tennis (blue table, low net) */}
      <group position={[SX.tt, 0, 0]}>
        <SportCourt surface="#15558b" line="#e9eef2" netH={0.35} netColor="#0e2c4a" />
        <TableTennisPaddle position={[0, 1.15, 2]} />
      </group>

      {/* Station 2 — Badminton (green court, tall net) */}
      <group position={[SX.bad, 0, 0]}>
        <SportCourt surface="#0e5c3f" line="#eaf2ec" netH={1.3} netColor="#0a3b28" />
        <BadmintonRacket position={[0, 1.25, 2]} />
      </group>

      {/* Station 3 — Pickleball (blue court, mid net) */}
      <group position={[SX.pick, 0, 0]}>
        <SportCourt surface="#1f6fb0" line="#eef4fa" netH={0.7} netColor="#123a5c" />
        <PickleballPaddle position={[0, 1.2, 2]} />
      </group>
    </>
  )
}
