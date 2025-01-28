import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { Response, Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('narady')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get(':link')
  async getVideo(
    @Param('link') link: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const video = await this.videosService.findVideo(link);

      const moscowOffset = 3 * 60 * 60 * 1000;
      const now = new Date();
      const moscowTime = new Date(now.getTime() + moscowOffset);
      if (moscowTime < video.start_date || moscowTime > video.end_date) {
        throw new NotFoundException('Что-то пошло не так!');
      }
      const videoPath = path.join(
        __dirname,
        '..',
        '..',
        'videos',
        `${video.video_title}.mp4`,
      );
      if (!fs.existsSync(videoPath)) {
        throw new NotFoundException('Что-то пошло не так!');
      }

      res.header('Content-Type', 'video/mp4');
      res.header(
        'Content-Disposition',
        `inline; filename="${video.video_title}.mp4"`,
      );

      const videoStream = fs.createReadStream(videoPath);
      videoStream.pipe(res);
    } catch (error) {
      throw new NotFoundException('Что-то пошло не так!', error);
    }
  }
}
