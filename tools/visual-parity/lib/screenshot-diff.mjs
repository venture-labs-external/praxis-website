import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Pixel-diffs two equally-sized PNG buffers (pads the smaller one with
 * transparent pixels if the pages differ slightly in height - that
 * difference is reported separately as `pageHeightDiff`).
 */
export function diffScreenshots(oldBuffer, newBuffer) {
  const oldPng = PNG.sync.read(oldBuffer);
  const newPng = PNG.sync.read(newBuffer);

  const width = Math.max(oldPng.width, newPng.width);
  const height = Math.max(oldPng.height, newPng.height);

  const pad = (png) => {
    if (png.width === width && png.height === height) return png.data;
    const padded = new PNG({ width, height });
    PNG.bitblt(png, padded, 0, 0, png.width, png.height, 0, 0);
    return padded.data;
  };

  const oldData = pad(oldPng);
  const newData = pad(newPng);
  const diff = new PNG({ width, height });

  const mismatched = pixelmatch(oldData, newData, diff.data, width, height, {
    threshold: 0.1,
  });

  return {
    width,
    height,
    mismatchedPixels: mismatched,
    percentage: (mismatched / (width * height)) * 100,
    diffPng: PNG.sync.write(diff),
  };
}
