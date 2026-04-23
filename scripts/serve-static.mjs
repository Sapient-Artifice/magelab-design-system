import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootArg = process.argv[2] ?? ".";
const port = Number(process.argv[3] ?? process.env.PORT ?? 4173);
const host = process.argv[4] ?? process.env.HOST ?? "127.0.0.1";
const root = path.resolve(process.cwd(), rootArg);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "content-type": type });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const candidate = path.resolve(root, `.${requested}`);

    if (!candidate.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    let filePath = candidate;
    let fileStat;

    try {
      fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        fileStat = await stat(filePath);
      }
    } catch {
      if (!path.extname(filePath)) {
        filePath = `${filePath}.html`;
        await access(filePath);
        fileStat = await stat(filePath);
      } else {
        send(res, 404, "Not found");
        return;
      }
    }

    const ext = path.extname(filePath);
    const contentType = contentTypes[ext] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    send(res, 500, `Server error: ${error instanceof Error ? error.message : String(error)}`);
  }
}).listen(port, host, () => {
  const rootLabel = fileURLToPath(new URL(`file://${root}/`));
  console.log(`serving ${rootLabel} at http://${host}:${port}`);
});
