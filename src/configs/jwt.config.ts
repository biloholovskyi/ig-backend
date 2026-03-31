import { registerAs } from '@nestjs/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const jwtConfig = registerAs('jwt', () => ({
  secret: required('JWT_SECRET'),
  refreshSecret: required('JWT_REFRESH_SECRET'),
  expiresIn: '15m',
  refreshExpiresIn: '7d',
}))

export type JwtConfig = ReturnType<typeof jwtConfig>
