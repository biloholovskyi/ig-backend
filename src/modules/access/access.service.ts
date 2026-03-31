import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { VerifyPasswordDto } from './dto/verify-password.dto'

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyPassword(_slug: string, _dto: VerifyPasswordDto): Promise<void> {
    // TODO: bcrypt.compare password with gallery.passwordHash
    // On success: issue short-lived access token (JWT, 24h) stored in HttpOnly cookie
  }
}
