import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files) {
    return this.appService.upload(files);
  }

  @Get('/files')
  getFiles() {
    return this.appService.getFiles();
  }

  @Get('/parsing')
  getParsing() {
    return this.appService.getParsing();
  }
}
