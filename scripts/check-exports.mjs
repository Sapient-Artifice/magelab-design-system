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
  "assets/brand-mark.svg",
  "effects/index.js",
];

for (const file of files) {
  await access(new URL(`../${file}`, import.meta.url));
}

console.log("exports ok");
