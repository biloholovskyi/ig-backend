import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from '@/configs/app.config'
import { databaseConfig } from '@/configs/database.config'
import { jwtConfig } from '@/configs/jwt.config'
import { supabaseConfig } from '@/configs/supabase.config'
import { PrismaModule } from '@/core/prisma/prisma.module'
import { SupabaseModule } from '@/core/supabase/supabase.module'
import { AccessModule } from '@/modules/access/access.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { GalleryModule } from '@/modules/gallery/gallery.module'
import { PhotoModule } from '@/modules/photo/photo.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, supabaseConfig],
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    GalleryModule,
    PhotoModule,
    AccessModule,
  ],
})
export class AppModule {}
