import { Injectable } from '@nestjs/common';
import { mkdir, stat, writeFile } from 'fs/promises';
import { basename, parse, resolve } from 'path';
import { buildAssetUrl, resolveAssetsPath } from '../assets/assets.constants';

const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;
const LATIN1_RANGE = /[\u0080-\u00ff]/;

type UploadFile = {
  originalname: string;
  buffer: Buffer;
  mimetype?: string;
  size?: number;
};

type UploadResult = {
  filename: string;
  url: string;
  mtime: number;
  savedPath: string;
  size: number;
  mimetype: string;
};

@Injectable()
export class UploadService {
  private readonly assetsPath: string;

  constructor() {
    this.assetsPath = resolveAssetsPath();
  }

  async saveImage(file: UploadFile): Promise<UploadResult> {
    const normalizedName = this.normalizeFilename(file.originalname);
    const sanitizedName = this.sanitizeFilename(normalizedName);
    const uniqueSuffix = Date.now();
    const { name, ext } = parse(sanitizedName);
    const baseName = ext ? name : sanitizedName;
    const filename = `${baseName}-${uniqueSuffix}${ext}`;
    const savedPath = resolve(this.assetsPath, filename);

    await mkdir(this.assetsPath, { recursive: true });
    await writeFile(savedPath, file.buffer);
    const fileStat = await stat(savedPath);
    const mtime = Math.round(fileStat.mtimeMs);

    return {
      filename,
      url: buildAssetUrl(filename),
      mtime,
      savedPath,
      size: file.size ?? file.buffer.length,
      mimetype: file.mimetype ?? 'application/octet-stream',
    };
  }

  private sanitizeFilename(originalName: string): string {
    const baseName = basename(originalName);
    const cleaned = baseName.replace(INVALID_FILENAME_CHARS, '_').trim();
    return cleaned.length > 0 ? cleaned : `upload-${Date.now()}`;
  }

  private normalizeFilename(originalName: string): string {
    if (!LATIN1_RANGE.test(originalName)) {
      return originalName;
    }

    const decoded = Buffer.from(originalName, 'latin1').toString('utf8');
    return decoded.includes('\uFFFD') ? originalName : decoded;
  }
}
