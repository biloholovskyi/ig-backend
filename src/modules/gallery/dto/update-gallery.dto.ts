import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateGalleryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean

  @IsBoolean()
  @IsOptional()
  isPasswordProtected?: boolean

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  coverPhotoId?: string
}
