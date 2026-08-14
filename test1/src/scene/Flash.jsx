import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { T } from '../store.js'

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const lerp = (a, b, t) => a + (b - a) * t

// soft radial glow texture (white core -> transparent)
function makeGlow() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.7)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function Flash() {
  const scroll = useScroll()
  const sprite = useRef()
  const tex = useMemo(makeGlow, [])

  useFrame(() => {
    if (!sprite.current) return
    const o = scroll.offset
    const x = clamp(1 - Math.abs(o - T.impact) / 0.09)
    const flash = x * x // sharp pop at impact
    sprite.current.visible = flash > 0.001
    const sc = lerp(0.12, 1.05, flash)
    sprite.current.scale.setScalar(sc)
    sprite.current.material.opacity = flash
  })

  return (
    <sprite ref={sprite} position={[0, 0.06, 0]} visible={false}>
      <spriteMaterial
        map={tex}
        color="#ffffff"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}
