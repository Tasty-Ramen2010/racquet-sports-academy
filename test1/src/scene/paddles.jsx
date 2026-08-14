import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Low-poly, procedurally-built rackets/paddles — consistent stylized look across all
// three sports. Each slowly turns so it's never static.

function Spinner({ children, speed = 0.4, ...props }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed
  })
  return <group ref={ref} {...props}>{children}</group>
}

export function TableTennisPaddle(props) {
  return (
    <Spinner {...props}>
      {/* blade — red rubber face + black backing */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 44]} />
        <meshStandardMaterial color="#c0392b" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.55, -0.04]}>
        <cylinderGeometry args={[0.54, 0.54, 0.03, 44]} />
        <meshStandardMaterial color="#16181b" roughness={0.7} />
      </mesh>
      {/* handle */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.17, 0.55, 0.1]} />
        <meshStandardMaterial color="#2b2420" roughness={0.7} />
      </mesh>
    </Spinner>
  )
}

export function BadmintonRacket(props) {
  // crosshatch string grid built from thin boxes
  const strings = []
  for (let i = -3; i <= 3; i++) {
    strings.push(<mesh key={`v${i}`} position={[i * 0.1, 0.95, 0]}><boxGeometry args={[0.006, 0.95, 0.006]} /><meshStandardMaterial color="#d8e2dc" /></mesh>)
    strings.push(<mesh key={`h${i}`} position={[0, 0.95 + i * 0.13, 0]}><boxGeometry args={[0.8, 0.006, 0.006]} /><meshStandardMaterial color="#d8e2dc" /></mesh>)
  }
  return (
    <Spinner {...props} speed={0.5}>
      {/* oval head frame */}
      <mesh position={[0, 0.95, 0]} scale={[1, 1.25, 1]}>
        <torusGeometry args={[0.46, 0.035, 16, 48]} />
        <meshStandardMaterial color="#16a085" roughness={0.35} metalness={0.3} />
      </mesh>
      {strings}
      {/* shaft + handle */}
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.03, 0.03, 0.55, 16]} /><meshStandardMaterial color="#16a085" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.1, 0.42, 0.1]} /><meshStandardMaterial color="#e8e2d6" roughness={0.7} /></mesh>
    </Spinner>
  )
}

export function PickleballPaddle(props) {
  return (
    <Spinner {...props} speed={0.45}>
      {/* solid rounded face */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.82, 1.12, 0.06]} />
        <meshStandardMaterial color="#1b3a6b" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* lime edge stripe */}
      <mesh position={[0, 0.6, 0.032]}>
        <boxGeometry args={[0.7, 1.0, 0.005]} />
        <meshStandardMaterial color="#c8ff3d" roughness={0.5} emissive="#7da81f" emissiveIntensity={0.2} />
      </mesh>
      {/* handle */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.09]} />
        <meshStandardMaterial color="#15171a" roughness={0.7} />
      </mesh>
    </Spinner>
  )
}
