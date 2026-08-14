import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { measure, uprightRotation } from './normalize.js'

const TARGET_H = 1.7  // display height of the racket (butt -> head)
const FLIP = true     // this model loads head-down; flip so grip is at the bottom, head on top

export default function Racket() {
  const { scene } = useGLTF('/models/racket.glb')

  const data = useMemo(() => {
    const obj = scene.clone(true)
    const { center, longest, longSize } = measure(obj)
    const rot = uprightRotation(longest)
    if (FLIP) rot[0] += Math.PI
    const s = TARGET_H / longSize
    return { obj, center, rot, s, halfH: TARGET_H / 2 }
  }, [scene])

  return (
    // outer group lifts the centered racket so its butt sits at y = 0
    <group position={[0, data.halfH, 0]}>
      <group rotation={data.rot} scale={data.s}>
        <primitive object={data.obj} position={[-data.center.x, -data.center.y, -data.center.z]} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/racket.glb')
