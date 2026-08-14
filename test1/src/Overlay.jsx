import { useEffect, useRef } from 'react'
import { progress } from './store.js'

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const ramp = (o, a, b, c, d) => {
  if (o <= a || o >= d) return 0
  if (o < b) return (o - a) / (b - a)
  if (o <= c) return 1
  return 1 - (o - c) / (d - c)
}

const SPORTS = [
  { idx: '01', side: 'left', name: 'Table\nTennis', tag: 'Ping pong, perfected.',
    stat: '10 tables · ARC, Cumming', copy: 'Coaching and memberships for enthusiasts of every level.' },
  { idx: '02', side: 'right', name: 'Badminton', tag: 'For endless smashes.',
    stat: '21 BWF courts · Yonex', copy: 'Beginner classes, coaching, and tournaments — beginners to pros.' },
  { idx: '03', side: 'left', name: 'Pickleball', tag: 'Fun-loaded dinks.',
    stat: '7 tournament courts · Selkirk', copy: 'Coaching, rec play and memberships on tournament-grade courts.' },
]

const SLATS = [
  { k: 'Two locations', v: 'Game & Grill, Alpharetta · ARC, Cumming, GA.' },
  { k: 'Top coaches', v: 'A premier academy with top coaches — beginners to professionals.' },
  { k: 'Pro shop', v: 'Yonex & Selkirk gear and apparel, in-house.' },
  { k: 'Come play', v: 'Memberships, classes, and summer camps for all three sports.' },
]

export default function Overlay() {
  const cue = useRef(), prog = useRef(), combined = useRef(), acc = useRef()
  const blocks = [useRef(), useRef(), useRef()]
  const slats = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    let raf
    const tick = () => {
      const o = progress.v
      blocks[0].current && (blocks[0].current.style.opacity = ramp(o, 0.0, 0.0, 0.11, 0.17))
      blocks[1].current && (blocks[1].current.style.opacity = ramp(o, 0.21, 0.26, 0.34, 0.4))
      blocks[2].current && (blocks[2].current.style.opacity = ramp(o, 0.41, 0.46, 0.54, 0.6))
      if (combined.current) combined.current.style.opacity = ramp(o, 0.6, 0.64, 0.69, 0.73)

      // diagonal accordion: one slat opens, the previous closes, as you scroll
      const a0 = 0.72, span = (1 - a0) / 4
      const active = o >= a0 ? clamp(Math.floor((o - a0) / span), 0, 3) : -1
      if (acc.current) acc.current.style.opacity = clamp((o - 0.7) / 0.03)
      slats.forEach((r, i) => r.current && r.current.classList.toggle('on', i === active))

      if (prog.current) prog.current.style.transform = `scaleX(${o})`
      if (cue.current) cue.current.style.opacity = o < 0.04 ? 0.8 : clamp(0.8 - (o - 0.04) / 0.04)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overlay">
      <div className="topbar">
        <div className="brand">FORTIUS</div>
        <div className="tag">Badminton · Pickleball · Table Tennis</div>
      </div>

      {/* per-sport data panels */}
      {SPORTS.map((s, i) => (
        <div className={`sportblock ${s.side}`} ref={blocks[i]} key={s.idx}>
          <span className="ghost">{s.idx}</span>
          <p className="mono ey">{s.idx} — Fortius</p>
          <span className="drule" />
          <h2 className="big">{s.name.split('\n').map((w, j) => <span key={j}>{w}<br /></span>)}</h2>
          <p className="tagline">{s.tag}</p>
          <p className="sub">{s.copy}</p>
          <p className="mono stat">{s.stat}</p>
        </div>
      ))}

      {/* all three together */}
      <div className="beat combined" ref={combined}>
        <span className="drule center" />
        <h2 className="big">Three sports.<br />One academy.</h2>
        <p className="sub">Love all? Dink, ping-pong, and smash — under one roof.</p>
      </div>

      {/* Fortius diagonal accordion */}
      <div className="acc" ref={acc}>
        {SLATS.map((s, i) => (
          <div className="slat" ref={slats[i]} key={s.k}>
            <div className="scontent">
              <span className="mono">0{i + 1}</span>
              <h3 className="big">{s.k}</h3>
              <p className="sub">{s.v}</p>
              {i === 3 && (
                <div className="cta">
                  <button className="btn fill">Book a court</button>
                  <button className="btn">(678) 505-0464</button>
                </div>
              )}
            </div>
            <span className="slabel">0{i + 1} · {s.k}</span>
          </div>
        ))}
      </div>

      <div className="cue" ref={cue}><span className="mono">scroll</span><span className="bar" /></div>
      <div className="progress"><span className="pfill" ref={prog} /></div>
    </div>
  )
}
