// Serves remote project images through Next's image optimizer (resized, WebP/AVIF).
// Hosts must match images.remotePatterns in next.config.ts.
const OPTIMIZABLE_HOSTS = [".supabase.co", "images.unsplash.com"];

function canOptimize(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(host));
  } catch {
    return false;
  }
}

export function optimizedImage(src: string, width: number, quality = 75) {
  if (!canOptimize(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

export function imageSrcSet(src: string, widths: number[]) {
  if (!canOptimize(src)) return undefined;
  return widths.map((width) => `${optimizedImage(src, width)} ${width}w`).join(", ");
}

// Widths must be in Next's default deviceSizes/imageSizes.
export const CARD_WIDTHS = [640, 828, 1080];
export const WIDE_WIDTHS = [828, 1200, 1920, 2048];
