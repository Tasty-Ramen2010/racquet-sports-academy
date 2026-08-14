import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Slow-drifting dust motes — the "floating particles in a spotlight" look that gives
// premium 3D sites their sense of depth and constant subtle motion.
const COUNT = 200

function makeDot() {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  gr.addColorStop(0, 'rgba(255,255,255,1)')
  gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(c)
}

export default function Atmosphere() {
  const pts = useRef()
  const tex = useMemo(makeDot, [])

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = Math.random() * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 0.5
      speeds[i] = 0.015 + Math.random() * 0.05
    }
    return { positions, speeds }
  }, [])

  useFrame((state, dt) => {
    if (!pts.current) return
    const p = pts.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      p[i * 3 + 1] -= speeds[i] * dt
      if (p[i * 3 + 1] < -0.3) p[i * 3 + 1] = 4.5
      p[i * 3] += Math.sin(t * 0.2 + i) * 0.0006 // gentle lateral sway
    }
    pts.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pts} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        map={tex}
        color="#bfe9d4"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
