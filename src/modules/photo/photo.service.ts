import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Photo } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'
import * as sharp from 'sharp'
import * as path from 'path'
import { PrismaService } from '@/core/prisma/prisma.service'
import { SupabaseService } from '@/core/supabase/supabase.service'
import { THUMBNAIL_WIDTH, LARGE_WIDTH, WEBP_QUALITY } from '@/shared/constants'
import { UpdatePhotoDto, ReorderPhotosDto } from './dto/photo.dto'

@Injectable()
export class PhotoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async upload(galleryId: string, ownerId: string, file: Express.Multer.File): Promise<Photo> {
    const gallery = await this.prisma.gallery.findFirst({
      where: { id: galleryId, ownerId },
    })
    if (!gallery) throw new NotFoundException('Gallery not found')

    const image = sharp(file.buffer)
    const metadata = await image.metadata()
    const width = metadata.width ?? 0
    const height = metadata.height ?? 0

    const [largeBuffer, thumbBuffer] = await Promise.all([
      sharp(file.buffer)
        .resize(LARGE_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .withMetadata(false as never)
        .toBuffer(),
      sharp(file.buffer)
        .resize(THUMBNAIL_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .withMetadata(false as never)
        .toBuffer(),
    ])

    const photoId = createId()
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '') || 'jpg'
    const originalPath = `${galleryId}/${photoId}-original.${ext}`
    const largePath = `${galleryId}/${photoId}-large.webp`
    const thumbPath = `${galleryId}/${photoId}-thumb.webp`

    await Promise.all([
      this.supabase.uploadFile(originalPath, file.buffer, file.mimetype),
      this.supabase.uploadFile(largePath, largeBuffer, 'image/webp'),
      this.supabase.uploadFile(thumbPath, thumbBuffer, 'image/webp'),
    ])

    const maxOrderResult = await this.prisma.photo.aggregate({
      where: { galleryId },
      _max: { order: true },
    })
    const nextOrder = (maxOrderResult._max.order ?? -1) + 1

    let photo: Photo
    try {
      photo = await this.prisma.photo.create({
        data: {
          id: photoId,
          galleryId,
          originalUrl: this.supabase.getPublicUrl(originalPath),
          largeUrl: this.supabase.getPublicUrl(largePath),
          thumbnailUrl: this.supabase.getPublicUrl(thumbPath),
          width,
          height,
          sizeBytes: file.size,
          order: nextOrder,
        },
      })
    } catch {
      await this.supabase
        .deleteFiles([originalPath, largePath, thumbPath])
        .catch(() => undefined)
      throw new InternalServerErrorException('Failed to save photo metadata')
    }

    return photo
  }

  async findAll(_galleryId: string): Promise<void> {
    // TODO: return all photos for a gallery ordered by `order` asc
  }

  async update(_id: string, _ownerId: string, _dto: UpdatePhotoDto): Promise<void> {
    // TODO: update caption or order
  }

  async remove(_id: string, _ownerId: string): Promise<void> {
    // TODO: delete from DB and Supabase Storage
  }

  async reorder(_galleryId: string, _ownerId: string, _dto: ReorderPhotosDto): Promise<void> {
    // TODO: update order field for each photo
  }
}
