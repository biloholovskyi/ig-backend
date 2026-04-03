import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { MAX_PHOTO_SIZE_BYTES, ALLOWED_MIME_TYPES } from '@/shared/constants'
import { UpdatePhotoDto, ReorderPhotosDto } from './dto/photo.dto'
import { PhotoService } from './photo.service'

@Controller()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('galleries/:galleryId/photos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if ((ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false)
        }
      },
    }),
  )
  upload(
    @Param('galleryId') galleryId: string,
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required')
    return this.photoService.upload(galleryId, userId, file)
  }

  @Get('galleries/:galleryId/photos')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('galleryId') galleryId: string) {
    return this.photoService.findAll(galleryId)
  }

  @Patch('photos/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdatePhotoDto,
  ) {
    return this.photoService.update(id, userId, dto)
  }

  @Delete('photos/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.photoService.remove(id, userId)
  }

  @Patch('galleries/:galleryId/photos/reorder')
  @UseGuards(JwtAuthGuard)
  reorder(
    @Param('galleryId') galleryId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: ReorderPhotosDto,
  ) {
    return this.photoService.reorder(galleryId, userId, dto)
  }
}
