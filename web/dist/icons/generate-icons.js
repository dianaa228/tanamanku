#!/usr/bin/env node
/**
 * Generate PWA icons for Tanamanku.
 * Run: node web/public/icons/generate-icons.js
 *
 * Creates placeholder SVG icons. For production, replace with real PNG icons
 * (192x192 and 512x512) from a design tool or https://icon.kitchen.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dir = path.join(__dirname);

function generateSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#2f7c52"/>
  <text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-size="${size * 0.55}">🌿</text>
</svg>`;
}

[192, 512].forEach((size) => {
  const svg = generateSVG(size);
  fs.writeFileSync(path.join(dir, `icon-${size}.svg`), svg);
  console.log(`✓ Created icon-${size}.svg`);
});

console.log('\nTo convert to PNG for production:');
console.log('  - Use https://icon.kitchen');
console.log('  - Or: npx sharp-cli -i public/icons/icon-512.svg -o public/icons/icon-512.png');
console.log('  - Or: npx sharp-cli -i public/icons/icon-192.svg -o public/icons/icon-192.png');
