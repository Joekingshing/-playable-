import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

type UploadFile = {
  originalname: string;
  buffer: Buffer;
  mimetype?: string;
  size?: number;
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: UploadFile) {
    if (!file) {
      throw new BadRequestException('file is required.');
    }

    if (file.mimetype && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed.');
    }

    return this.uploadService.saveImage(file);
  }
}
