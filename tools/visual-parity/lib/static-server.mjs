// A minimal static file server for a Nuxt `generate` output (`dist/`) - no
// new runtime dependency, just `node:http`/`node:fs`.
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(root, urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  let candidate = join(root, clean);
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    candidate = join(candidate, 'index.html');
  }
  if (!existsSync(candidate) && !extname(clean)) {
    // Nuxt generate emits `<route>/index.html` - a request for the bare
    // route without a trailing slash still needs to resolve to it.
    const withIndex = join(root, clean, 'index.html');
    if (existsSync(withIndex)) candidate = withIndex;
  }
  if (!existsSync(candidate)) {
    const notFound = join(root, '404.html');
    if (existsSync(notFound)) return { path: notFound, status: 404 };
    return null;
  }
  return { path: candidate, status: 200 };
}

export function createStaticServer(root) {
  return http.createServer((req, res) => {
    const resolved = resolveFile(root, req.url ?? '/');
    if (!resolved) {
      res.writeHead(404).end('not found');
      return;
    }
    const mime = MIME[extname(resolved.path)] ?? 'application/octet-stream';
    res.writeHead(resolved.status, { 'Content-Type': mime });
    createReadStream(resolved.path).pipe(res);
  });
}

export function listen(root, port) {
  return new Promise((resolve, reject) => {
    const server = createStaticServer(root);
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
