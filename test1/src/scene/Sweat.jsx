import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { T } from '../store.js'

const N = 40
const G = 5.0
const FLIGHT = 0.8
const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)

const dummy = new THREE.Object3D()
const vel = new THREE.Vector3()
const UP = new THREE.Vector3(0, 1, 0)
const quat = new THREE.Quaternion()

export default function Sweat() {
  const scroll = useScroll()
  const drops = useRef()

  // each droplet: a launch direction (mostly upward, like a crown splash) + speed + size
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, () => {
        const az = Math.random() * Math.PI * 2
        const elev = (55 + Math.random() * 32) * (Math.PI / 180) // 55–87° from horizontal
        const speed = 0.5 + Math.random() * 0.95
        return {
          vx: Math.cos(elev) * Math.cos(az) * speed,
          vy: Math.sin(elev) * speed,
          vz: Math.cos(elev) * Math.sin(az) * speed,
          sz: 0.007 + Math.random() * 0.016,
        }
      }),
    []
  )

  useFrame(() => {
    if (!drops.current) return
    const o = scroll.offset
    const tp = clamp((o - T.impact) / 0.14) // quick splash during the ground-up beat
    const live = tp > 0 && tp < 1
    drops.current.visible = live
    if (!live) return

    const t = tp * FLIGHT
    for (let i = 0; i < N; i++) {
      const s = seeds[i]
      const y = 0.02 + s.vy * t - 0.5 * G * t * t
      if (y <= 0.004) {
        dummy.scale.setScalar(0)
      } else {
        dummy.position.set(s.vx * t, y, s.vz * t)
        // orient + stretch along current velocity (teardrop trailing its motion)
        vel.set(s.vx, s.vy - G * t, s.vz)
        const spd = vel.length()
        vel.normalize()
        quat.setFromUnitVectors(UP, vel)
        dummy.quaternion.copy(quat)
        const stretch = 1 + spd * 0.9
        dummy.scale.set(s.sz * 0.7, s.sz * stretch, s.sz * 0.7)
      }
      dummy.updateMatrix()
      drops.current.setMatrixAt(i, dummy.matrix)
    }
    drops.current.instanceMatrix.needsUpdate = true
    drops.current.material.opacity = clamp(1 - tp * 0.6)
  })

  return (
    <instancedMesh ref={drops} args={[null, null, N]} visible={false}>
      <sphereGeometry args={[1, 10, 10]} />
      {/* glossy water bead — reflects the green environment */}
      <meshStandardMaterial
        color="#eaf6ef"
        roughness={0.05}
        metalness={0}
        envMapIntensity={2.2}
        transparent
        opacity={1}
      />
    </instancedMesh>
  )
}
