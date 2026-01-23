import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('list')
  async listAssets() {
    return this.assetsService.listAssets();
  }

  @Get(':filename')
  async getAsset(@Param('filename') filename: string, @Res() res: Response) {
    const fullPath = await this.assetsService.getAssetPath(filename);
    return res.sendFile(fullPath);
  }
}
