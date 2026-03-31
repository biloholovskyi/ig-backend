import { Body, Controller, Param, Post } from '@nestjs/common'
import { AccessService } from './access.service'
import { VerifyPasswordDto } from './dto/verify-password.dto'

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post(':slug/verify')
  verifyPassword(@Param('slug') slug: string, @Body() dto: VerifyPasswordDto) {
    return this.accessService.verifyPassword(slug, dto)
  }
}
