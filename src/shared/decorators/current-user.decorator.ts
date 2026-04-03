import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from '@/modules/auth/strategies/jwt.strategy'

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): string | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>()
    const user = request.user
    return data ? user[data] : user
  },
)
