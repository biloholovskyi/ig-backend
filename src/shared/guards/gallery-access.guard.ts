import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class GalleryAccessGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // TODO: implement full gallery access check
    // Logic: gallery is public OR valid access cookie present
    // For now, allow all access (stub — implement with GalleryService lookup)
    return true
  }
}
