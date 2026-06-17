/**
 * Reads an image File entirely in the browser, downscales it so its largest
 * dimension is <= maxDim, and returns a compressed data URL.
 *
 * No upload server / Cloudinary needed — the returned string can be stored
 * directly in a DB field and used as an <img src>. Lets the user pick an
 * image of ANY size; large photos are scaled down automatically so the
 * stored payload stays small.
 */
export async function imageToDataUrl(file: File, maxDim = 700, quality = 0.85): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }

  // SVG is vector + tiny — keep as-is (canvas would rasterize it).
  if (file.type === 'image/svg+xml') {
    return readAsDataUrl(file);
  }

  const sourceUrl = await readAsDataUrl(file);
  const img = await loadImage(sourceUrl);

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width || 1;
  canvas.height = height || 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceUrl; // very old browser fallback

  ctx.drawImage(img, 0, 0, width, height);

  // WebP keeps transparency (good for logos) and compresses well.
  const webp = canvas.toDataURL('image/webp', quality);
  if (webp.startsWith('data:image/webp')) return webp;

  // Safari < 14 etc. — fall back to PNG (lossless, keeps transparency).
  return canvas.toDataURL('image/png');
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the image file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the image'));
    img.src = src;
  });
}
