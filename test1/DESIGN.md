# FORTIUS — Design System & Build Notes

A **scroll-driven film** for a badminton club whose mission is to promote the sport —
the angle in the copy is *"badminton is harder than you think."*

Borrowed from the Hollow Purple reveal in *JJK*: a single drop meeting a surface, blooming
where it lands. Here the drop is the **shuttle**, the surface is a **green court** (video),
the bloom is a **white-hot flash** at contact. No red, no blue — green + cream only.

---

## Palette — UI off the neon-on-black default

| Token | Hex | Role |
|---|---|---|
| background | `#000000` | True black. The arena. |
| `--ink` | `#0B0F0D` | Near-black UI ground. |
| `--bone` | `#ECE7DA` | Primary text + the brand wordmark. Warm off-white. |
| `--court` | `#0E5C3F` | Court green — lives in the 3D (shader court + the racket model). |
| `--lime` | `#C8FF3D` | Acid accent — **hairlines only** (progress bar, active part-tick, the unit). |
| `--ash` | `#8A8F86` | Secondary text. |

The green stays in the 3D where it belongs (the court, the racket); the chrome is bone-on-ink
with a single lime hairline. That deliberately avoids the generic "neon-green-everywhere" look.

## Type — one Archivo superfamily
**Archivo** across the whole site, worked across its width + weight axes so a single typeface
carries the identity:
- **Display:** Archivo *Expanded* (`font-stretch:125%`), heavy — wide, architectural caps.
- **Body:** Archivo normal width.
- **Labels / eyebrows:** Archivo, tracked uppercase (replaces the mono-eyebrow default).

Chosen over the Anton + Inter + JetBrains-Mono default because that trio is the template "AI"
look; a wide grotesque superfamily reads as deliberate premium sportswear and reflects the
geometry/precision of the court.

## The film (scroll offset 0 → 1, keyframes in `src/store.js`)

```
0.00–0.18  FALL       shuttle drops CORK-FIRST onto the procedural green court.
0.18       CONTACT     white flash + a crown SPLASH of reflective droplets (real, not rings).
0.18–0.34  GROUND-UP   camera drops near the floor just behind the contact, cranes upward.
                        --- then a Ciao-style 4-part climb up the racket, each a held "stop":
0.34–0.50  01 GRIP     white grip fills frame, rest cut off behind the right-side caption.
0.50–0.66  02 SHAFT    the green shaft only.
0.66–0.82  03 STRINGS  the string bed only.
0.82–1.00  04 RACKET   pull out to the whole racket + CTA.
```

Borrowed from the two references: **Ciao** (product anchored, text to the side, each scroll
section frames one part) drives the 4-part racket reveal; **Cairo** (editorial HUD) drives the
left part-index, the bottom progress bar, and the right-aligned captions. Copy is real Fortius
Sports Academy content (tagline, 21-courts stat, "Book a court", phone).

---

## Code map
- `src/App.jsx` — Canvas, ScrollControls (5 pages), Bloom + Vignette post.
- `src/scene/Experience.jsx` — the timeline: camera path + all object animation.
- `src/scene/Court.jsx` — **procedural** green court: a GLSL shader draws real badminton
  line markings + sheen, fading to black at the edges. (No video; the watermarked stock
  clip in `public/video/` is unused.)
- `src/scene/Shuttle.jsx` / `Racket.jsx` — load + auto-normalize the real GLBs.
- `src/scene/Sweat.jsx` — crown splash of velocity-stretched, glossy droplets (post-impact).
- `src/Overlay.jsx` — hero/impact beats + the 4 part captions, left part-index HUD, progress bar.
- `src/scene/Flash.jsx` — additive white glow sprite at contact.
- `src/Overlay.jsx` — DOM captions, cross-faded via shared `progress` in `store.js`.

## Tweak points (likely need a pass once you watch it)
- **Shuttle orientation** — `ROT_X` in `Shuttle.jsx`. If it falls feathers-first, flip to `-Math.PI/2`.
- **Timing** — all beat offsets live in `store.js` (`T`).
- **Camera path** — `camPath()` in `Experience.jsx` (positions + lookAt per segment).
- **Sizes** — `TARGET` (shuttle) / `TARGET_H` (racket) in their components.

## Assets
`public/models/{racket,shuttle}.glb`, `public/video/court.mp4`. Originals (incl. the
source `.IGS`) still in the project root. Racket is 10 MB / shuttle 631 meshes — a Draco
pass (`/3d-model-optimize`) is the obvious next optimization.

## Run
`npm install` → `npm run dev` (http://localhost:3000) · `npm run build` for production.
