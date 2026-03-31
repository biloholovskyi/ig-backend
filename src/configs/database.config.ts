import { registerAs } from '@nestjs/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const databaseConfig = registerAs('database', () => ({
  url: required('DATABASE_URL'),
  directUrl: required('DIRECT_URL'),
}))

export type DatabaseConfig = ReturnType<typeof databaseConfig>
