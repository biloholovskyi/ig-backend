import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AppConfig } from '@/configs/app.config'
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter'
import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor'
import { globalValidationPipe } from '@/shared/pipes/validation.pipe'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const appConfig = app.get<AppConfig>('app')

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    origin: appConfig.frontendUrl,
    credentials: true,
  })
  app.enableShutdownHooks()
  app.useGlobalPipes(globalValidationPipe)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(appConfig.port)
}

void bootstrap()
