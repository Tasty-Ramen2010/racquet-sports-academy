import { useProgress } from '@react-three/drei'

export default function Loader() {
  const { active, progress } = useProgress()
  return (
    <div
      className="loader"
      style={{
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.6s ease 0.2s',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="l-brand">FORTIUS</div>
        <div className="l-pct">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}
