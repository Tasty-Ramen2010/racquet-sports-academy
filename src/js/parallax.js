// Real parallax: each layer translates at a fraction of the scroll delta
// based on its distance from the viewport centre. Foreground layers get a
// larger speed than background layers, producing genuine depth — not a
// single hero shift. Driven by a rAF-throttled passive scroll listener.
export function initParallax(scope = document) {
  const layers = [...scope.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.15,
    rot: parseFloat(el.dataset.parallaxRot || '0'),
  }));
  if (!layers.length) return;

  let ticking = false;
  const vh = () => window.innerHeight;

  function update() {
    const mid = vh() / 2;
    for (const l of layers) {
      const r = l.el.getBoundingClientRect();
      // distance of this layer's centre from the viewport centre
      const delta = r.top + r.height / 2 - mid;
      const ty = -delta * l.speed;
      const rot = l.rot ? (delta / mid) * l.rot : 0;
      l.el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)${rot ? ` rotate(${rot.toFixed(2)}deg)` : ''}`;
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
