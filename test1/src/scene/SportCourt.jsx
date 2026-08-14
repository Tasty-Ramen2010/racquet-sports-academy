import { useMemo } from 'react'
import * as THREE from 'three'

// Net grid texture (white lines on transparent), tiled across the net plane.
function makeNet() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  g.strokeStyle = 'rgba(255,255,255,0.8)'
  g.lineWidth = 2
  for (let i = 0; i <= s; i += 8) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke()
    g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

// One sport "station": a colored court with a border, a centre line, and a net whose
// height + color change per sport.
export default function SportCourt({ surface, line, netH, netColor, ...props }) {
  const net = useMemo(makeNet, [])
  const W = 7, L = 11, t = 0.04
  const border = (key, pos, size) => (
    <mesh key={key} position={pos}><boxGeometry args={size} /><meshStandardMaterial color={line} /></mesh>
  )
  return (
    <group {...props}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color={surface} roughness={0.85} metalness={0.05} />
      </mesh>
      {/* boundary + centre lines (just above the floor) */}
      {border('t', [0, 0.011, -L / 2], [W, t, t])}
      {border('b', [0, 0.011, L / 2], [W, t, t])}
      {border('l', [-W / 2, 0.011, 0], [t, t, L])}
      {border('r', [W / 2, 0.011, 0], [t, t, L])}
      {border('c', [0, 0.011, 0], [W, t, t])}
      {/* net across the centre line */}
      <mesh position={[0, netH / 2, 0]}>
        <planeGeometry args={[W, netH]} />
        <meshBasicMaterial map={net} color={netColor} transparent side={THREE.DoubleSide}
          opacity={0.9} depthWrite={false} onUpdate={(m) => { net.repeat.set(22, Math.max(1, netH * 4)) }} />
      </mesh>
      {/* white tape on top of the net */}
      <mesh position={[0, netH, 0]}><boxGeometry args={[W, 0.05, 0.05]} /><meshStandardMaterial color="#f2efe4" /></mesh>
    </group>
  )
}
