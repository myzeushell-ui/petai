const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");

// PetAI icon: white paw print on green gradient circle
function makeIconSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.48;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.015}" flood-color="#000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <g transform="translate(${cx} ${cy}) scale(${size / 1024})" filter="url(#shadow)">
    <!-- Paw pad (palm) -->
    <ellipse cx="0" cy="60" rx="160" ry="135" fill="#FFFFFF"/>
    <!-- Top-left toe -->
    <ellipse cx="-145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(-18)"/>
    <!-- Top-right toe -->
    <ellipse cx="145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(18)"/>
    <!-- Left toe -->
    <ellipse cx="-230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(-60)"/>
    <!-- Right toe -->
    <ellipse cx="230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(60)"/>
  </g>
</svg>`;
}

function makeAdaptiveSVG(size) {
  // Foreground only — Android adaptive icon needs ~66% safe zone
  const cx = size / 2;
  const cy = size / 2;
  const scale = (size / 1024) * 0.6; // smaller for safe zone

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#22c55e"/>
  <g transform="translate(${cx} ${cy}) scale(${scale})">
    <ellipse cx="0" cy="60" rx="160" ry="135" fill="#FFFFFF"/>
    <ellipse cx="-145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(-18)"/>
    <ellipse cx="145" cy="-135" rx="60" ry="80" fill="#FFFFFF" transform="rotate(18)"/>
    <ellipse cx="-230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(-60)"/>
    <ellipse cx="230" cy="20" rx="55" ry="75" fill="#FFFFFF" transform="rotate(60)"/>
  </g>
</svg>`;
}

async function main() {
  // App icon (1024x1024)
  await sharp(Buffer.from(makeIconSVG(1024)))
    .png()
    .toFile(path.join(assetsDir, "icon.png"));
  console.log("✓ icon.png");

  // Adaptive icon foreground (1024x1024 with safe zone)
  await sharp(Buffer.from(makeAdaptiveSVG(1024)))
    .png()
    .toFile(path.join(assetsDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png");

  // Splash icon (1024x1024 — same as icon for splash screen)
  await sharp(Buffer.from(makeIconSVG(1024)))
    .png()
    .toFile(path.join(assetsDir, "splash-icon.png"));
  console.log("✓ splash-icon.png");

  // Favicon (48x48)
  await sharp(Buffer.from(makeIconSVG(48)))
    .png()
    .toFile(path.join(assetsDir, "favicon.png"));
  console.log("✓ favicon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
