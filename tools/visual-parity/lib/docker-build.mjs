// Builds a static export of this repo (old or new tree) inside the Node
// version its own `.nvmrc` names, using Docker - the same pattern the
// company's stored build command uses (`nvmrc-image.mjs`/`mount-path.mjs` in
// the agent-cluster repo), reimplemented here in ~20 lines so this tool has
// no dependency on a path outside this repo.
import { spawn } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';

function mountPath(dir) {
  // Docker Desktop on Windows wants the Windows-spelled, forward-slashed
  // path (`D:/a/b`), not Git Bash's `/d/a/b`.
  const real = realpathSync.native(dir);
  return process.platform === 'win32' ? real.replace(/\\/g, '/') : real;
}

function nvmrcImage(dir) {
  const raw = readFileSync(join(dir, '.nvmrc'), 'utf8').trim();
  if (!/^v?\d+(\.\d+){0,2}$/.test(raw)) {
    throw new Error(
      `docker-build: ${join(dir, '.nvmrc')} says ${JSON.stringify(raw)}, which is not a version`,
    );
  }
  return `node:${raw.replace(/^v/, '')}-alpine`;
}

function run(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)),
    );
  });
}

/**
 * Runs `yarn install --frozen-lockfile && yarn generate` for `dir` inside
 * the Node/Alpine image its own `.nvmrc` names. Returns the path to the
 * generated `dist/` folder (inside `dir`).
 */
export async function buildStaticExport(dir, { label } = {}) {
  const image = nvmrcImage(dir);
  console.log(`[visual-parity] building ${label ?? dir} in ${image}...`);
  await run('docker', [
    'run',
    '--rm',
    '-v',
    `${mountPath(dir)}:/app`,
    '-w',
    '/app',
    image,
    'sh',
    '-c',
    'yarn install --frozen-lockfile && yarn generate',
  ]);
  return join(dir, 'dist');
}
