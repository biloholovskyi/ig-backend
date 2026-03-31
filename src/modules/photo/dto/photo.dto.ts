import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdatePhotoDto {
  @IsString()
  @IsOptional()
  caption?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number
}

export class ReorderPhotosDto {
  @IsArray()
  @IsString({ each: true })
  orderedIds!: string[]
}
