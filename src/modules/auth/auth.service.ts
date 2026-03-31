import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(_dto: RegisterDto): Promise<void> {
    // TODO: implement registration
  }

  async login(_dto: LoginDto): Promise<void> {
    // TODO: implement login — verify credentials, issue JWT
  }

  async logout(_userId: string): Promise<void> {
    // TODO: implement logout — invalidate refresh token
  }

  async refresh(_refreshToken: string): Promise<void> {
    // TODO: implement token refresh
  }

  async getMe(_userId: string): Promise<void> {
    // TODO: return current user profile
  }
}
