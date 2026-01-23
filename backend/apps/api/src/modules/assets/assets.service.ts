import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { basename, resolve } from 'path';
import {
  buildAssetUrl,
  isAllowedImageFilename,
  resolveAssetsPath,
} from './assets.constants';

type AssetItem = {
  filename: string;
  url: string;
  mtime: number;
};

type AssetListResponse = {
  items: AssetItem[];
};

@Injectable()
export class AssetsService {
  private readonly assetsPath = resolveAssetsPath();

  async listAssets(): Promise<AssetListResponse> {
    let entries: string[];
    try {
      entries = await readdir(this.assetsPath, { encoding: 'utf8' });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === 'ENOENT') {
          return { items: [] };
        }
      }
      throw error;
    }

    const items = await Promise.all(
      entries.map(async (filename) => {
        if (!isAllowedImageFilename(filename)) {
          return null;
        }
        const fullPath = resolve(this.assetsPath, filename);
        try {
          const fileStat = await stat(fullPath);
          if (!fileStat.isFile()) {
            return null;
          }
          return {
            filename,
            url: buildAssetUrl(filename),
            mtime: Math.round(fileStat.mtimeMs),
          };
        } catch (error) {
          if (error instanceof Error && 'code' in error) {
            const code = (error as NodeJS.ErrnoException).code;
            if (code === 'ENOENT') {
              return null;
            }
          }
          throw error;
        }
      }),
    );

    const filtered = items.filter((item): item is AssetItem => item !== null);
    filtered.sort((a, b) => {
      const byTime = a.mtime - b.mtime;
      if (byTime !== 0) {
        return byTime;
      }
      return a.filename.localeCompare(b.filename);
    });

    return { items: filtered };
  }

  async getAssetPath(filename: string): Promise<string> {
    const safeName = basename(filename);
    if (safeName !== filename) {
      throw new BadRequestException('Invalid filename.');
    }
    if (!isAllowedImageFilename(safeName)) {
      throw new NotFoundException('File not found.');
    }

    const fullPath = resolve(this.assetsPath, safeName);
    try {
      const fileStat = await stat(fullPath);
      if (!fileStat.isFile()) {
        throw new NotFoundException('File not found.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && 'code' in error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === 'ENOENT') {
          throw new NotFoundException('File not found.');
        }
      }
      throw error;
    }

    return fullPath;
  }
}
