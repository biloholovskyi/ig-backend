import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as jwksRsa from 'jwks-rsa'
import { SupabaseConfig } from '@/configs/supabase.config'

export interface JwtPayload {
  sub: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const supabaseConfig = configService.get<SupabaseConfig>('supabase')!
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${supabaseConfig.url}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256'],
    })
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload
  }
}
