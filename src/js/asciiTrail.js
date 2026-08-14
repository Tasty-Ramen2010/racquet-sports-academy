// Thin single-character ASCII stream that follows the cursor. As the mouse
// moves, single glyphs are dropped at even spacing along the path and fade out
// — a one-glyph-wide stream, not a field. White over the dark parallax, black
// over the light site (setDark). Regular cursor stays visible.
const CHARS = ':~-/\\|_=+<>*'.split('');

// ~25% of the previous trail length: glyphs fade ~4× faster (decay 0.022 → 0.088)
export function initAsciiTrail({ spacing = 14, size = 16, decay = 0.088, max = 32 } = {}) {
  if (window.matchMedia('(pointer: coarse)').matches) {
    return { setDark: () => {} };
  }
  const canvas = document.getElementById('ascii-trail');
  if (!canvas) return { setDark: () => {} };
  const ctx = canvas.getContext('2d');

  let w, h;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }
  resize();
  window.addEventListener('resize', resize);

  const parts = [];
  const spawn = { x: null, y: null };
  let dark = false; // false → white (dark bg); true → black (light bg)

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    if (spawn.x === null) {
      spawn.x = x;
      spawn.y = y;
      return;
    }
    let dx = x - spawn.x;
    let dy = y - spawn.y;
    let d = Math.hypot(dx, dy);
    if (d === 0) return;
    const ux = dx / d;
    const uy = dy / d;
    // drop evenly spaced glyphs along the segment so fast moves stay continuous
    while (d >= spacing) {
      spawn.x += ux * spacing;
      spawn.y += uy * spacing;
      d -= spacing;
      parts.push({ x: spawn.x, y: spawn.y, ch: CHARS[(Math.random() * CHARS.length) | 0], life: 1 });
      if (parts.length > max) parts.shift();
    }
  });

  function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, w, h);
    const rgb = dark ? '12, 12, 16' : '255, 255, 255';
    ctx.font = `700 ${size}px 'Space Mono', ui-monospace, monospace`;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= decay;
      if (p.life <= 0) {
        parts.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(${rgb}, ${(p.life * 0.95).toFixed(3)})`;
      ctx.fillText(p.ch, p.x, p.y);
    }
  }
  frame();

  return {
    setDark(v) {
      dark = v;
    },
  };
}
