import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('../public/images/logo.png', import.meta.url));
const outMark = fileURLToPath(new URL('../public/images/logo-mark.png', import.meta.url));
const outBadge = fileURLToPath(new URL('../public/images/logo-badge.png', import.meta.url));

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Uint8Array(data);

let min = 255;
let max = 0;
for (let i = 0; i < px.length; i += 4) {
  const lum = (px[i] + px[i + 1] + px[i + 2]) / 3;
  min = Math.min(min, lum);
  max = Math.max(max, lum);
}

const span = Math.max(max - min, 1);
const thresh = min + span * 0.08;

for (let i = 0; i < px.length; i += 4) {
  const lum = (px[i] + px[i + 1] + px[i + 2]) / 3;
  if (lum <= thresh) {
    px[i] = 0;
    px[i + 1] = 0;
    px[i + 2] = 0;
    px[i + 3] = 0;
  } else {
    const t = Math.min(1, (lum - thresh) / (span * 0.7));
    px[i] = 18;
    px[i + 1] = 28;
    px[i + 2] = 48;
    px[i + 3] = Math.round(190 + t * 65);
  }
}

const mark = await sharp(Buffer.from(px), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

await sharp(mark).toFile(outMark);

const size = 320;
const plate = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#fff8ea"/>
      <stop offset="100%" stop-color="#e8d5a8"/>
    </radialGradient>
  </defs>
  <circle cx="160" cy="160" r="154" fill="url(#g)" stroke="#ffb347" stroke-width="8"/>
</svg>`);

await sharp(plate)
  .png()
  .composite([{ input: mark, gravity: 'centre' }])
  .toFile(outBadge);

console.log('Wrote logo-badge.png');
