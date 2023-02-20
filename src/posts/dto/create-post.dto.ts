import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  body?: string;

  @IsNotEmpty()
  @IsBoolean()
  published?: boolean;
}
