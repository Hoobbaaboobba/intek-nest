import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async findVideo(link: string) {
    return await this.prisma.videos.findUnique({
      where: { link },
    });
  }

  async findUser(video_title: string) {
    return await this.prisma.videoAccess.findFirst({
      where: { video_title },
    });
  }

  async updateUser(id: number) {
    return await this.prisma.videoAccess.update({
      data: {
        access_status: 1,
      },
      where: { id },
    });
  }
}
