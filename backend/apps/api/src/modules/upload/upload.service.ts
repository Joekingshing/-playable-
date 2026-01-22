import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { basename, resolve } from 'path';

const DEFAULT_ASSETS_PATH = 'E:\\testfile';
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;

type UploadFile = {
  originalname: string;
  buffer: Buffer;
  mimetype?: string;
  size?: number;
};

type UploadResult = {
  filename: string;
  savedPath: string;
  size: number;
  mimetype: string;
};

@Injectable()
export class UploadService {
  private readonly assetsPath: string;

  constructor() {
    const rawPath = process.env.UPLOAD_ASSETS_PATH ?? DEFAULT_ASSETS_PATH;
    this.assetsPath = resolve(rawPath);
  }

  async saveImage(file: UploadFile): Promise<UploadResult> {
    const sanitizedName = this.sanitizeFilename(file.originalname);
    const filename = `${Date.now()}-${sanitizedName}`;
    const savedPath = resolve(this.assetsPath, filename);

    await mkdir(this.assetsPath, { recursive: true });
    await writeFile(savedPath, file.buffer);

    return {
      filename,
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
}
