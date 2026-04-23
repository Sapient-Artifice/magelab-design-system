import { access } from "node:fs/promises";

const files = [
  "src/index.css",
  "src/tokens.css",
  "src/base.css",
  "src/utilities.css",
  "src/tokens.json",
];

for (const file of files) {
  await access(new URL(`../${file}`, import.meta.url));
}

console.log("exports ok");
