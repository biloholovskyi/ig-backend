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
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { GalleryService } from './gallery.service'

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('galleries')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.galleryService.findAll('')
  }

  @Post('galleries')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateGalleryDto) {
    return this.galleryService.create('', dto)
  }

  @Get('galleries/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id, '')
  }

  @Patch('galleries/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateGalleryDto) {
    return this.galleryService.update(id, '', dto)
  }

  @Delete('galleries/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id, '')
  }

  @Get('g/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.galleryService.findBySlug(slug)
  }
}
