/**
 * Image normalisation helpers. Every example is center-cropped to a square and
 * scaled to a fixed size, so polaroids look tidy and the ML pipeline (Phase 3)
 * gets consistent input. Output is a compact JPEG data URL — small enough to
 * persist many of them in IndexedDB.
 */

/** Stored square size in px. MobileNet wants 224²; 256 leaves a little headroom. */
export const EXAMPLE_SIZE = 256;

/** Reject files larger than this to keep memory + storage sane. */
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

function cropSquareToDataUrl(
  source: CanvasImageSource,
  width: number,
  height: number,
): string {
  const side = Math.min(width, height);
  const sx = (width - side) / 2;
  const sy = (height - side) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = EXAMPLE_SIZE;
  canvas.height = EXAMPLE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get a 2D canvas context');

  ctx.drawImage(source, sx, sy, side, side, 0, 0, EXAMPLE_SIZE, EXAMPLE_SIZE);
  return canvas.toDataURL('image/jpeg', 0.85);
}

/** Convert an uploaded image File into a normalised square data URL. */
export async function fileToExampleDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('That file is not a picture.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('That picture is too big.');
  }
  const bitmap = await createImageBitmap(file);
  try {
    return cropSquareToDataUrl(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

/** Capture the current frame of a playing <video> as a normalised square data URL. */
export function videoFrameToExampleDataUrl(video: HTMLVideoElement): string {
  return cropSquareToDataUrl(video, video.videoWidth, video.videoHeight);
}
