const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function svg(size, brand = true) {
  const cx = size / 2, cy = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.22}"/>
  <g transform="translate(${cx} ${cy}) scale(${size / 1024 * 0.55})">
    <ellipse cx="0" cy="60" rx="160" ry="135" fill="#FFFFFF"/>
    <ellipse cx="-145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(-18)"/>
    <ellipse cx="145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(18)"/>
    <ellipse cx="-230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(-60)"/>
    <ellipse cx="230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(60)"/>
  </g>
</svg>`;
}

const sizes = [180, 192, 512, 167, 152, 120];

async function main() {
  for (const s of sizes) {
    const filename = s === 180 ? "apple-touch-icon.png" : `icon-${s}.png`;
    await sharp(Buffer.from(svg(s))).png().toFile(path.join(outDir, filename));
    console.log("✓", filename);
  }
  // Also save to public/ root for default apple-touch-icon
  await sharp(Buffer.from(svg(180))).png().toFile(path.join(__dirname, "..", "public", "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png");
}

main().catch(console.error);
