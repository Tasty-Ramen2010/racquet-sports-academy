import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { measure, uprightRotation } from './normalize.js'

const TARGET = 0.22  // display size of the shuttle's long axis
const FLIP = true    // cork (head) points DOWN so it lands cork-first

export default function Shuttle() {
  const { scene } = useGLTF('/models/shuttle.glb')

  const data = useMemo(() => {
    const obj = scene.clone(true)
    const { center, longest, longSize } = measure(obj)
    const rot = uprightRotation(longest)
    if (FLIP) rot[0] += Math.PI
    const s = TARGET / longSize

    // center the raw model, then bake rotation+scale into a group and measure its
    // post-transform bottom so we can pin the LOWEST point (the cork) to y = 0.
    obj.position.set(-center.x, -center.y, -center.z)
    const rotG = new THREE.Group()
    rotG.rotation.set(rot[0], rot[1], rot[2])
    rotG.scale.setScalar(s)
    rotG.add(obj)
    rotG.updateMatrixWorld(true)
    const bottom = new THREE.Box3().setFromObject(rotG).min.y

    return { rotG, bottom }
  }, [scene])

  // group origin now sits exactly at the cork tip: place this group at the court (y=0)
  // and the cork touches the surface.
  return (
    <group position={[0, -data.bottom, 0]}>
      <primitive object={data.rotG} />
    </group>
  )
}

useGLTF.preload('/models/shuttle.glb')
