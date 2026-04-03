import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from '@supabase/supabase-js'
import { SupabaseConfig } from '@/configs/supabase.config'
import { STORAGE_BUCKET } from '@/shared/constants'

type SupabaseClientType = ReturnType<typeof createClient>

@Injectable()
export class SupabaseService {
  private readonly _adminClient: SupabaseClientType
  private readonly _anonClient: SupabaseClientType

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<SupabaseConfig>('supabase')!
    this._adminClient = createClient(config.url, config.serviceKey)
    this._anonClient = createClient(config.url, config.anonKey)
  }

  /** Use for file storage operations */
  get storage() {
    return this._adminClient.storage
  }

  /** Use for admin auth operations: createUser, signOut(jwt) */
  get adminAuth() {
    return this._adminClient.auth
  }

  /** Use for regular auth operations: signInWithPassword, refreshSession */
  get auth() {
    return this._anonClient.auth
  }

  async uploadFile(path: string, buffer: Buffer, contentType: string): Promise<void> {
    const { error } = await this._adminClient.storage.from(STORAGE_BUCKET).upload(path, buffer, {
      contentType,
      upsert: true,
    })
    if (error) throw new InternalServerErrorException(`Storage upload failed: ${error.message}`)
  }

  getPublicUrl(path: string): string {
    const { data } = this._adminClient.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async deleteFiles(paths: string[]): Promise<void> {
    if (paths.length === 0) return
    const { error } = await this._adminClient.storage.from(STORAGE_BUCKET).remove(paths)
    if (error) throw new InternalServerErrorException(`Storage delete failed: ${error.message}`)
  }
}
