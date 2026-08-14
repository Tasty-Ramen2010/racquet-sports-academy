// Shared site chrome: the dynamic-island nav and the footer, injected into
// every page so markup stays in one place. Also wires island behaviour
// (reveal, condense-on-scroll, light/dark glass).
const NAV = [
  { label: 'Home', href: 'index.html', key: 'home' },
  { label: 'Membership', href: 'membership.html', key: 'membership' },
  { label: 'Coaching', href: 'coaching.html', key: 'coaching' },
  { label: 'Events', href: 'events.html', key: 'events' },
];

export function initChrome({ page = 'home' } = {}) {
  injectNav(page);
  injectFooter();
  return wireIsland(page);
}

function injectNav(page) {
  const mount = document.querySelector('[data-chrome="nav"]');
  if (!mount) return;
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}" class="${n.key === page ? 'is-current' : ''}">${n.label}</a>`
  ).join('');
  mount.outerHTML = `
    <nav id="island" class="island" aria-label="Primary">
      <a class="island__logo" href="index.html" aria-label="Fortius home">
        <span class="island__dot"></span>Fortius
      </a>
      <div class="island__links">${links}</div>
      <a href="contact.html" class="island__cta">Book Now</a>
    </nav>`;
}

function injectFooter() {
  const mount = document.querySelector('[data-chrome="footer"]');
  if (!mount) return;
  mount.outerHTML = `
    <footer class="footer">
      <div class="footer__top">
        <div class="footer__brand">
          Fortius<span>Sports Academy · ATL</span>
          <p>21 BWF-standard badminton courts, tournament pickleball and table tennis — one home for the game in Alpharetta.</p>
        </div>
        <div class="footer__col">
          <h4>Explore</h4>
          <a href="membership.html">Membership</a>
          <a href="coaching.html">Coaching</a>
          <a href="events.html">Events</a>
          <a href="about.html">About</a>
        </div>
        <div class="footer__col">
          <h4>Visit</h4>
          <a href="https://maps.google.com/?q=5905+Ronald+Reagan+Blvd+Alpharetta+GA" target="_blank" rel="noopener">Game &amp; Grill — Alpharetta</a>
          <a href="https://maps.google.com/?q=2711+Pine+Grove+Rd+Cumming+GA" target="_blank" rel="noopener">ARC — Cumming</a>
          <a href="tel:+16785050464">(678) 505-0464</a>
          <a href="mailto:fortius@fsaatl.com">fortius@fsaatl.com</a>
        </div>
      </div>
      <div class="footer__fine">
        <span>© 2026 Fortius Sports Academy · Alpharetta, Georgia</span>
        <span>
          <a href="https://instagram.com/fortius_sports_academy_atl" target="_blank" rel="noopener">Instagram</a> ·
          <a href="https://youtube.com/@Fortiussports" target="_blank" rel="noopener">YouTube</a> ·
          <a href="https://facebook.com/61573843050481" target="_blank" rel="noopener">Facebook</a>
        </span>
      </div>
    </footer>`;
}

function wireIsland(page) {
  const island = document.getElementById('island');
  if (!island) return { setLight: () => {} };

  const isPage = page !== 'home';
  // visible from the first frame everywhere; dark glass on the home hero,
  // light glass on the sub-pages (and on home once the white site appears).
  island.classList.add('is-visible');
  if (isPage) island.classList.add('is-light');

  // Cheap, reliable "settle" behaviour: a single class toggle once you've
  // scrolled past the first screen, with hysteresis so it can't thrash. Links
  // stay clickable at all times — no pointer-events traps, no layout animation.
  let compact = false;
  let ticking = false;
  function apply() {
    const want = window.scrollY > window.innerHeight * 0.7;
    if (want !== compact) {
      compact = want;
      island.classList.toggle('is-compact', compact);
    }
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    },
    { passive: true }
  );
  apply();

  return {
    setLight(v) {
      island.classList.toggle('is-light', v);
    },
  };
}
