// Knock the white studio background out of the player photos at runtime,
// turning them into clean transparent cutouts for the dark intro stage.
// Uses a flood-fill seeded from the image border, so only background-
// connected white is removed — interior whites (shoes, lines) stay intact.
export function cutout(imgEl, { threshold = 236, maxW = 1100 } = {}) {
  const src = imgEl.dataset.src || imgEl.currentSrc || imgEl.src;
  if (!src) return;
  const tmp = new Image();
  tmp.crossOrigin = 'anonymous';
  tmp.onload = () => {
    const scale = Math.min(1, maxW / tmp.naturalWidth);
    const w = Math.round(tmp.naturalWidth * scale);
    const h = Math.round(tmp.naturalHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(tmp, 0, 0, w, h);

    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const n = w * h;
    const visited = new Uint8Array(n);
    const stack = new Int32Array(n);
    let sp = 0;

    const isBg = (p) => {
      const i = p * 4;
      // near-white = all channels high and low saturation
      return d[i] >= threshold && d[i + 1] >= threshold && d[i + 2] >= threshold;
    };

    // seed every border pixel
    for (let x = 0; x < w; x++) {
      stack[sp++] = x;                 // top row
      stack[sp++] = (h - 1) * w + x;   // bottom row
    }
    for (let y = 0; y < h; y++) {
      stack[sp++] = y * w;             // left col
      stack[sp++] = y * w + (w - 1);   // right col
    }

    while (sp > 0) {
      const p = stack[sp - 1];
      sp--;
      if (visited[p]) continue;
      if (!isBg(p)) continue;
      visited[p] = 1;
      d[p * 4 + 3] = 0; // transparent

      const x = p % w;
      const y = (p / w) | 0;
      if (x > 0) stack[sp++] = p - 1;
      if (x < w - 1) stack[sp++] = p + 1;
      if (y > 0) stack[sp++] = p - w;
      if (y < h - 1) stack[sp++] = p + w;
      // guard against overflow on pathological images
      if (sp >= n - 4) sp = n - 4;
    }

    // 1px soft edge: fade pixels that touch a transparent neighbour
    const out = ctx.createImageData(w, h);
    out.data.set(d);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        const a = d[p * 4 + 3];
        if (a === 0) continue;
        if (
          d[(p - 1) * 4 + 3] === 0 || d[(p + 1) * 4 + 3] === 0 ||
          d[(p - w) * 4 + 3] === 0 || d[(p + w) * 4 + 3] === 0
        ) {
          out.data[p * 4 + 3] = 150;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    imgEl.src = canvas.toDataURL('image/png');
    imgEl.classList.add('is-cut');
  };
  tmp.onerror = () => {}; // leave original src in place
  tmp.src = src;
}

export function cutoutAll(selector = '.js-cutout') {
  document.querySelectorAll(selector).forEach((el) => cutout(el));
}
