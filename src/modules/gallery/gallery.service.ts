import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(_ownerId: string): Promise<void> {
    // TODO: return all galleries for the authenticated photographer
  }

  async create(_ownerId: string, _dto: CreateGalleryDto): Promise<void> {
    // TODO: create gallery, auto-generate slug from name
  }

  async findOne(_id: string, _ownerId: string): Promise<void> {
    // TODO: return gallery by id, verify ownership
  }

  async findBySlug(_slug: string): Promise<void> {
    // TODO: return published gallery by slug (public access)
  }

  async update(_id: string, _ownerId: string, _dto: UpdateGalleryDto): Promise<void> {
    // TODO: update gallery, verify ownership
  }

  async remove(_id: string, _ownerId: string): Promise<void> {
    // TODO: delete gallery and all photos (cascade), verify ownership
  }
}
