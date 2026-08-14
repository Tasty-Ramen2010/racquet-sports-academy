import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Pixelation } from '@react-three/postprocessing'
import Experience from './scene/Experience.jsx'
import Overlay from './Overlay.jsx'
import Loader from './Loader.jsx'
import { fx } from './store.js'

export default function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        camera={{ position: [-9, 1.7, 6.4], fov: 42, near: 0.01, far: 100 }}
      >
        <color attach="background" args={['#05070a']} />
        <fog attach="fog" args={['#05070a', 13, 36]} />

        <Suspense fallback={null}>
          <ScrollControls pages={7} damping={0.3}>
            <Experience />
          </ScrollControls>
          <Preload all />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.85} luminanceSmoothing={0.15} />
          {/* pixel-stretch: RGB split + pixelation, both driven by scroll velocity */}
          <ChromaticAberration ref={(r) => { fx.ca = r }} offset={[0, 0]} />
          <Pixelation ref={(r) => { fx.pixel = r }} granularity={0} />
          <Vignette eskil={false} offset={0.25} darkness={0.88} />
        </EffectComposer>
      </Canvas>

      <Overlay />
      <Loader />
    </>
  )
}
