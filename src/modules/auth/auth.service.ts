import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { SupabaseService } from '@/core/supabase/supabase.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: Date
}

interface RegisterResponse extends TokenResponse {
  user: UserProfile
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const { data, error } = await this.supabase.adminAuth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    })
    if (error) throw new BadRequestException(error.message)

    const user = await this.prisma.user.create({
      data: { id: data.user.id, email: dto.email, name: dto.name },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    const { data: session, error: signInError } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    })
    if (signInError) throw new InternalServerErrorException(signInError.message)

    return {
      user,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      expires_in: session.session.expires_in,
    }
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    })
    if (error) throw new UnauthorizedException('Invalid credentials')
    const { session } = data
    if (!session) throw new UnauthorizedException('Invalid credentials')

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
    }
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })
    if (error) throw new UnauthorizedException('Invalid refresh token')
    const { session } = data
    if (!session) throw new UnauthorizedException('Invalid refresh token')

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
    }
  }

  async logout(accessToken: string): Promise<void> {
    const { error } = await this.supabase.adminAuth.admin.signOut(accessToken)
    if (error) throw new InternalServerErrorException(error.message)
  }

  async getMe(userId: string): Promise<UserProfile> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }
}
