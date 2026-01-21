import {
  Controller,
  Get,
  InternalServerErrorException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get()
  async downloadExport(@Res({ passthrough: true }) res: Response) {
    const { archive, filename } = await this.exportService.createArchive();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    archive.on('error', (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Export archive failed.';
      throw new InternalServerErrorException(message);
    });

    void archive.finalize();
    return new StreamableFile(archive);
  }
}
