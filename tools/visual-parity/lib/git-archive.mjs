// Materialises another branch's tree into a disposable temp directory
// without ever checking it out in this worktree (the task's branch is the
// only one this session may have checked out) - `git archive <ref> | tar -x`,
// both spawned directly so no shell pipe syntax is involved.
import { spawn } from 'node:child_process';

// On Windows, Git for Windows ships its own MSYS `tar` earlier on PATH than
// the OS's native one; that MSYS build re-mangles a Windows-style
// backslashed path (from `os.tmpdir()`) on its own, independently of
// whatever shell started this script, and fails with ENOENT. The native
// `tar.exe` under System32 (bundled with Windows 10+) does not have that
// problem, so it is used explicitly when present.
const TAR_BIN =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\tar.exe' : 'tar';

export function archiveBranch(repoRoot, ref, destDir) {
  return new Promise((resolve, reject) => {
    const archive = spawn('git', ['archive', '--format=tar', ref], {
      cwd: repoRoot,
    });
    const extract = spawn(TAR_BIN, ['-x', '-C', destDir], {
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    archive.stdout.pipe(extract.stdin);
    archive.on('error', reject);
    extract.on('error', reject);
    archive.stderr.on('data', (chunk) => process.stderr.write(chunk));
    extract.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`tar exited ${code}`)),
    );
  });
}

/**
 * Makes sure `ref` is reachable in `repoRoot`'s local history, fetching it
 * from `origin` by its own name/SHA first if it is not - lets a fresh clone
 * (no local `main`/old branch already checked out or fetched) run the
 * documented `yarn compare` command unmodified, with the baseline commit
 * (never a branch, never the live domain - this task's own constraint)
 * resolved and archived below without a human having to fetch it by hand
 * first. A no-op (one quick `git cat-file`) when `ref` is already present,
 * which is the common case once a run has fetched it once.
 */
export function ensureRefFetched(repoRoot, ref) {
  return new Promise((resolve, reject) => {
    const check = spawn('git', ['cat-file', '-e', `${ref}^{commit}`], {
      cwd: repoRoot,
    });
    check.on('error', reject);
    check.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      console.log(
        `[visual-parity] ${ref} not found locally, fetching from origin...`,
      );
      const fetch = spawn('git', ['fetch', 'origin', ref], {
        cwd: repoRoot,
        stdio: 'inherit',
      });
      fetch.on('error', reject);
      fetch.on('exit', (fetchCode) =>
        fetchCode === 0
          ? resolve()
          : reject(new Error(`git fetch origin ${ref} exited ${fetchCode}`)),
      );
    });
  });
}

/** Resolves `ref` to the short commit it currently points at, for the report. */
export function resolveCommit(repoRoot, ref) {
  return new Promise((resolve, reject) => {
    const proc = spawn('git', ['rev-parse', '--short', ref], {
      cwd: repoRoot,
    });
    let out = '';
    proc.stdout.on('data', (chunk) => {
      out += chunk;
    });
    proc.on('error', reject);
    proc.on('exit', (code) =>
      code === 0
        ? resolve(out.trim())
        : reject(new Error(`git rev-parse ${ref} exited ${code}`)),
    );
  });
}
