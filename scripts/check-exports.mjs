import { access } from "node:fs/promises";

const files = [
  "src/index.css",
  "src/tokens.css",
  "src/base.css",
  "src/utilities.css",
  "src/effects.css",
  "src/tokens.json",
  "tokens/tokens.source.json",
  "assets/favicon.ico",
  "assets/favicon.png",
  "assets/favicon-32x32.png",
  "assets/favicon-16x16.png",
  "assets/favicon-96x96.png",
  "assets/apple-icon.png",
  "assets/apple-icon-180x180.png",
  "assets/android-icon-36x36.png",
  "assets/android-icon-48x48.png",
  "assets/android-icon-72x72.png",
  "assets/android-icon-96x96.png",
  "assets/android-icon-144x144.png",
  "assets/android-icon-192x192.png",
  "assets/icon-512.webp",
  "assets/manifest.json",
  "assets/browserconfig.xml",
  "assets/ms-icon-70x70.png",
  "assets/ms-icon-150x150.png",
  "assets/ms-icon-310x310.png",
  "assets/brand-mark.svg",
  "effects/index.js",
  "vendor/three.core.js",
  "vendor/three.module.js",
];

for (const file of files) {
  await access(new URL(`../${file}`, import.meta.url));
}

console.log("exports ok");
