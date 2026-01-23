import { extname, resolve } from 'path';

export const DEFAULT_ASSETS_PATH = 'E:\\testfile';
export const ASSETS_ROUTE_PREFIX = '/assets';
export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

export function resolveAssetsPath(): string {
  const rawPath = process.env.UPLOAD_ASSETS_PATH ?? DEFAULT_ASSETS_PATH;
  return resolve(rawPath);
}

export function buildAssetUrl(filename: string): string {
  return `${ASSETS_ROUTE_PREFIX}/${filename}`;
}

export function isAllowedImageFilename(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}
