import { Injectable, NotFoundException } from '@nestjs/common';
import archiver, { type Archiver } from 'archiver';
import { stat } from 'fs/promises';
import { basename, resolve } from 'path';

const DEFAULT_EXPORT_PATH = 'E:\\playable\\playable-phaser';
const NODE_MODULES_PATTERN = /(^|\/)node_modules($|\/)/;
type ArchiveEntry = { name: string };

@Injectable()
export class ExportService {
  private readonly sourcePath: string;

  constructor() {
    const rawPath = process.env.EXPORT_SOURCE_PATH ?? DEFAULT_EXPORT_PATH;
    this.sourcePath = resolve(rawPath);
  }

  async createArchive(): Promise<{ archive: Archiver; filename: string }> {
    const stats = await stat(this.sourcePath).catch(() => null);
    if (!stats || !stats.isDirectory()) {
      throw new NotFoundException(`Export source not found: ${this.sourcePath}`);
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.directory(
      this.sourcePath,
      basename(this.sourcePath),
      (entry: ArchiveEntry) => {
      if (NODE_MODULES_PATTERN.test(entry.name)) {
        return false;
      }
      return entry;
      },
    );

    const filename = `${Date.now()}.zip`;
    return { archive, filename };
  }
}
