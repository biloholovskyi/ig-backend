import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshDto } from './dto/refresh.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtPayload } from './strategies/jwt.strategy'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const token = (req.headers.authorization ?? '').split(' ')[1]
    return this.authService.logout(token)
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.getMe(req.user.sub)
  }
}
