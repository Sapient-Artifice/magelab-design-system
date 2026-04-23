import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const distRoot = new URL("../dist/", import.meta.url);

await rm(distRoot, { recursive: true, force: true });
await mkdir(distRoot, { recursive: true });

await cp(new URL("../catalog/", import.meta.url), new URL("../dist/catalog/", import.meta.url), {
  recursive: true,
});
await cp(new URL("../assets/", import.meta.url), new URL("../dist/assets/", import.meta.url), {
  recursive: true,
});
await cp(new URL("../effects/", import.meta.url), new URL("../dist/effects/", import.meta.url), {
  recursive: true,
});
await cp(new URL("../src/", import.meta.url), new URL("../dist/src/", import.meta.url), {
  recursive: true,
});
await cp(new URL("../docs/", import.meta.url), new URL("../dist/docs/", import.meta.url), {
  recursive: true,
});

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./catalog/index.html" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Magelab Design System Catalog</title>
  </head>
  <body>
    <p>Redirecting to <a href="./catalog/index.html">catalog</a>…</p>
  </body>
</html>
`;

await writeFile(new URL("../dist/index.html", import.meta.url), indexHtml);

console.log("catalog built");
