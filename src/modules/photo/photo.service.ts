import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { SupabaseService } from '@/core/supabase/supabase.service'
import { UpdatePhotoDto, ReorderPhotosDto } from './dto/photo.dto'

@Injectable()
export class PhotoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async upload(_galleryId: string, _ownerId: string, _file: Express.Multer.File): Promise<void> {
    // TODO: process with Sharp (thumbnail + large), upload to Supabase, save to DB
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
