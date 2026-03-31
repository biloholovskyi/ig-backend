import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@supabase/supabase-js'
import { SupabaseConfig } from '@/configs/supabase.config'

type SupabaseClientType = ReturnType<typeof createClient>

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClientType

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<SupabaseConfig>('supabase')!
    this.client = createClient(config.url, config.serviceKey)
  }

  get storage() {
    return this.client.storage
  }

  get auth() {
    return this.client.auth
  }
}
