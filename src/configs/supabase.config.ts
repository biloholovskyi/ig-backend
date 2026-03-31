import { registerAs } from '@nestjs/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const supabaseConfig = registerAs('supabase', () => ({
  url: required('SUPABASE_URL'),
  serviceKey: required('SUPABASE_SERVICE_KEY'),
}))

export type SupabaseConfig = ReturnType<typeof supabaseConfig>
