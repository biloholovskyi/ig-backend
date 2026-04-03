export const MAX_PHOTO_SIZE_MB = 20
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024
export const THUMBNAIL_WIDTH = 400
export const LARGE_WIDTH = 1920
export const BCRYPT_ROUNDS = 12
export const ACCESS_TOKEN_COOKIE = 'gallery_access'
export const AUTH_COOKIE_NAME = 'auth_token'

export const STORAGE_BUCKET = 'gallery'
export const WEBP_QUALITY = 80
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'] as const
