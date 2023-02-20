import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/utils/constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  role?: UserRole;
}
