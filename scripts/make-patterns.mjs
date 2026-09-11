/** Islamic line geometry: 8-fold khatam / octagon only — never a hexagram. */
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
mkdirSync(join(root, 'patterns'), { recursive: true });

const n = (v) => Number(v).toFixed(2);

/** Square vertices at distance R from center. offsetDeg 0 = diamond, 45 = axis-aligned. */
const squarePts = (cx, cy, R, offsetDeg = 0) => {
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = ((offsetDeg + i * 90) * Math.PI) / 180;
    pts.push(`${n(cx + R * Math.cos(a))},${n(cy + R * Math.sin(a))}`);
  }
  return pts.join(' ');
};

const octagonPts = (cx, cy, R) => {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (Math.PI / 4) * i;
    pts.push(`${n(cx + R * Math.cos(a))},${n(cy + R * Math.sin(a))}`);
  }
  return pts.join(' ');
};

const twoSquares = (cx, cy, R) =>
  `<polygon points="${squarePts(cx, cy, R, 0)}"/>
    <polygon points="${squarePts(cx, cy, R, 45)}"/>`;

/** Line-art 8-fold rosette: two squares + octagon, like the gold motif sheets. */
const rosette = (cx, cy, R) => `
    ${twoSquares(cx, cy, R)}
    <polygon points="${octagonPts(cx, cy, R * 0.72)}"/>
    ${twoSquares(cx, cy, R * 0.42)}
    <polygon points="${octagonPts(cx, cy, R * 0.22)}"/>`;

const latticeTile = (size, step, R) => {
  const nodes = [];
  for (let y = -step; y <= size + step; y += step) {
    for (let x = -step; x <= size + step; x += step) {
      nodes.push(twoSquares(x, y, R));
      nodes.push(`<polygon points="${octagonPts(x, y, R * 0.52)}"/>`);
      nodes.push(twoSquares(x + step / 2, y + step / 2, R * 0.42));
      nodes.push(`<polygon points="${octagonPts(x + step / 2, y + step / 2, R * 0.24)}"/>`);
    }
  }
  return nodes.join('\n    ');
};

/** Large, thin girih wallpaper — 8-fold khatam + octagon, never a hexagram. */
const screen = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <g fill="none" stroke="#c9a24a" stroke-width="0.7" stroke-linejoin="round" opacity="0.42">
    ${latticeTile(640, 160, 74)}
  </g>
</svg>
`;

const header = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96">
  <defs>
    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3d48a" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#f3d48a" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#hg)" stroke-width="1.35">
    <path d="M12 92 V44 C12 22 28 10 48 6 C68 10 84 22 84 44 V92"/>
    <path d="M92 92 V44 C92 22 108 10 128 6 C148 10 164 22 164 44 V92"/>
    <path d="M172 92 V44 C172 22 188 10 208 6 C228 10 244 22 244 44 V92"/>
  </g>
  <g fill="#e8d5a3" opacity="0.28">
    <path d="M56 28c-6.4 1.1-11.2 6.6-11.2 13.2 0 7.3 5.9 13.2 13.2 13.2 2.1 0 4.1-.5 5.9-1.4-2.1 3.4-5.9 5.7-10.2 5.7-7.1 0-12.9-5.8-12.9-12.9 0-8.2 7.5-14.8 15.2-16.8z"/>
    <path d="M136 28c-6.4 1.1-11.2 6.6-11.2 13.2 0 7.3 5.9 13.2 13.2 13.2 2.1 0 4.1-.5 5.9-1.4-2.1 3.4-5.9 5.7-10.2 5.7-7.1 0-12.9-5.8-12.9-12.9 0-8.2 7.5-14.8 15.2-16.8z"/>
    <path d="M216 28c-6.4 1.1-11.2 6.6-11.2 13.2 0 7.3 5.9 13.2 13.2 13.2 2.1 0 4.1-.5 5.9-1.4-2.1 3.4-5.9 5.7-10.2 5.7-7.1 0-12.9-5.8-12.9-12.9 0-8.2 7.5-14.8 15.2-16.8z"/>
  </g>
</svg>
`;

const mihrab = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 400" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff6d8"/>
      <stop offset="0.45" stop-color="#f3d48a"/>
      <stop offset="1" stop-color="#c9a24a"/>
    </linearGradient>
    <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <clipPath id="arch">
      <path d="M42 392 V168 C42 78 92 32 140 18 C188 32 238 78 238 168 V392 Z"/>
    </clipPath>
  </defs>
  <path filter="url(#glow)" fill="none" stroke="#f3d48a" stroke-width="18" opacity="0.55"
    d="M42 392 V168 C42 78 92 32 140 18 C188 32 238 78 238 168 V392"/>
  <rect x="42" y="18" width="196" height="374" fill="#011a2d" clip-path="url(#arch)"/>
  <g clip-path="url(#arch)" fill="none" stroke="#e8d5a3" stroke-width="0.85" opacity="0.42">
    ${latticeTile(280, 56, 26)}
  </g>
  <path fill="none" stroke="url(#gold)" stroke-width="8" stroke-linejoin="round"
    d="M42 392 V168 C42 78 92 32 140 18 C188 32 238 78 238 168 V392"/>
  <path fill="none" stroke="#fff6d8" stroke-width="1.6" opacity="0.85"
    d="M54 384 V172 C54 90 98 44 140 32 C182 44 226 90 226 172 V384"/>
  <circle cx="140" cy="78" r="26" fill="#011a2d"/>
  <circle cx="140" cy="78" r="24" fill="none" stroke="#f3d48a" stroke-width="1.6"/>
  <g fill="none" stroke="#f3d48a" stroke-width="1.05">
    ${twoSquares(140, 78, 13)}
  </g>
  <path fill="#f3d48a" d="M148 66.4c-6.6 1.1-11.5 6.8-11.5 13.6 0 7.5 6.1 13.6 13.6 13.6 2.2 0 4.2-.5 6-1.5-2.2 3.4-5.9 5.6-10.1 5.6-6.6 0-12-5.4-12-12 0-7.9 7-14.2 14-16.7z"/>
</svg>
`;

const cornerMark = `
  <path d="M5 59 V5 H59" stroke-width="1.8"/>
  <path d="M5 48 V12 H16" stroke-width="1.15"/>
  <g transform="translate(30 30)">
    ${rosette(0, 0, 18)}
  </g>
`;

const cornerSvg = (deg) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <g fill="none" stroke="#c9a24a" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round" transform="rotate(${deg} 32 32)">
    ${cornerMark}
  </g>
</svg>
`;

const bandUnit = (x, y, s) => `
    <polygon points="${octagonPts(x, y, s)}"/>
    <polygon points="${squarePts(x, y, s * 0.62, 45)}"/>`;

/** 9-slice picture frame: gold moulding + octagon band. No tiny stars in corners. */
const frame = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <g fill="none" stroke="#c9a24a" stroke-linejoin="round" stroke-linecap="square">
    <rect x="1.4" y="1.4" width="93.2" height="93.2" stroke-width="2.4"/>
    <rect x="6" y="6" width="84" height="84" stroke-width="0.8" opacity="0.7"/>
    <rect x="26.5" y="26.5" width="43" height="43" stroke-width="1.15"/>
    <g stroke-width="1.05" opacity="0.9">
      ${bandUnit(48, 16, 8)}
      ${bandUnit(16, 48, 8)}
      ${bandUnit(80, 48, 8)}
      ${bandUnit(48, 80, 8)}
    </g>
    <path stroke-width="1.5" d="M5 28 V5 H28"/>
    <path stroke-width="1.5" d="M68 5 H91 V28"/>
    <path stroke-width="1.5" d="M91 68 V91 H68"/>
    <path stroke-width="1.5" d="M28 91 H5 V68"/>
  </g>
</svg>
`;

const logo = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="DIBS">
  <rect width="80" height="80" rx="16" fill="#011a2d"/>
  <path fill="none" stroke="#e8d5a3" stroke-width="2.2"
    d="M18 70 V38 C18 24 28 16 40 12 C52 16 62 24 62 38 V70"/>
  <path fill="#e8d5a3" d="M47.4 30.4c-8.4 1.4-14.6 8.6-14.6 17.2 0 9.5 7.7 17.2 17.2 17.2 2.8 0 5.4-.7 7.6-1.9-2.7 4.2-7.4 7-12.7 7-8.3 0-15-6.7-15-15 0-9.8 8.8-17.8 17.5-21z"/>
</svg>
`;

writeFileSync(join(root, 'patterns', 'screen.svg'), screen);
writeFileSync(join(root, 'patterns', 'girih-bg.svg'), screen);
writeFileSync(join(root, 'patterns', 'mashrabiya.svg'), screen);
writeFileSync(join(root, 'patterns', 'girih.svg'), screen);
writeFileSync(join(root, 'patterns', 'header.svg'), header);
writeFileSync(join(root, 'patterns', 'header-arch.svg'), header);
writeFileSync(join(root, 'patterns', 'mihrab.svg'), mihrab);
writeFileSync(join(root, 'patterns', 'frame.svg'), frame);
writeFileSync(join(root, 'patterns', 'corner.svg'), cornerSvg(0));
writeFileSync(join(root, 'patterns', 'corner-tl.svg'), cornerSvg(0));
writeFileSync(join(root, 'patterns', 'corner-tr.svg'), cornerSvg(90));
writeFileSync(join(root, 'patterns', 'corner-br.svg'), cornerSvg(180));
writeFileSync(join(root, 'patterns', 'corner-bl.svg'), cornerSvg(270));
writeFileSync(join(root, 'logo.svg'), logo);
writeFileSync(join(root, '..', 'favicon.svg'), logo);

const zellijSrc = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'islamic inspired', 'pngtree-islamic-art.jpg');
if (existsSync(zellijSrc)) {
  copyFileSync(zellijSrc, join(root, 'patterns', 'zellij.jpg'));
}

console.log('islamic frames and lattices written');
