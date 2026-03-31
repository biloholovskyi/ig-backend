import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { UpdatePhotoDto, ReorderPhotosDto } from './dto/photo.dto'
import { PhotoService } from './photo.service'

@Controller()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('galleries/:galleryId/photos')
  @UseGuards(JwtAuthGuard)
  upload(@Param('galleryId') galleryId: string) {
    return this.photoService.upload(galleryId, '', {} as Express.Multer.File)
  }

  @Get('galleries/:galleryId/photos')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('galleryId') galleryId: string) {
    return this.photoService.findAll(galleryId)
  }

  @Patch('photos/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePhotoDto) {
    return this.photoService.update(id, '', dto)
  }

  @Delete('photos/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.photoService.remove(id, '')
  }

  @Patch('galleries/:galleryId/photos/reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Param('galleryId') galleryId: string, @Body() dto: ReorderPhotosDto) {
    return this.photoService.reorder(galleryId, '', dto)
  }
}
