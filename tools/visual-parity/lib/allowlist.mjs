import { readFileSync } from 'node:fs';

export function loadAllowlist(path) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw)) throw new Error(`${path}: expected a JSON array`);
  for (const entry of raw) {
    if (!entry.reason || typeof entry.reason !== 'string') {
      throw new Error(
        `${path}: every allow-list entry needs a one-line "reason" - found ${JSON.stringify(entry)}`,
      );
    }
  }
  return raw;
}

/** True if `entry` (minus its `reason`) is a subset-match of `diff`. */
function matches(entry, diff) {
  return Object.entries(entry).every(
    ([key, value]) => key === 'reason' || diff[key] === value,
  );
}

export function partitionByAllowlist(differences, allowlist) {
  const allowed = [];
  const blocking = [];
  for (const diff of differences) {
    const hit = allowlist.find((entry) => matches(entry, diff));
    if (hit) allowed.push({ ...diff, allowedReason: hit.reason });
    else blocking.push(diff);
  }
  return { allowed, blocking };
}
