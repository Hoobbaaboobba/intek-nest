import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('narady')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  async checkUserAccess(title: string) {
    const user = await this.videosService.findUser(title);
    if (user.access_status === 1) {
      console.error('User access status is 1. Throwing error...');
      throw new NotFoundException('Что-то пошло не так!');
    }
    if (user.access_status === 0) {
      await this.videosService.updateUser(user.id);
    }
    return user;
  }

  @Post('/visited/:title')
  async logVisit(@Param('title') title: string, @Res() res: Response) {
    try {
      await this.checkUserAccess(title);
      console.log(`[LOG] Посетитель зашел на сайт: ${title}`);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Что-то пошло не так!' });
    }
  }

  @Get(':link')
  async getVideo(@Param('link') link: string, @Res() res: Response) {
    try {
      const video = await this.videosService.findVideo(link);
      await this.checkUserAccess(video.video_title);
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
        throw new Error('Видео не найдено');
      }

      const videoUrl = `/videos/${video.video_title}.mp4`;
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Видео</title>
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    if (!sessionStorage.getItem("visited")) {
                        sessionStorage.setItem("visited", "true");

                        fetch("/narady/visited/${video.video_title}", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ visited: true }),
                        })
                        .then(response => response.json())
                    }
                });
            </script>
        </head>
        <body>
            <video controls width="640">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        </body>
        </html>
      `;

      res.send(htmlContent);
    } catch (error) {
      throw new NotFoundException('Что-то пошло не так!', error);
    }
  }
}
