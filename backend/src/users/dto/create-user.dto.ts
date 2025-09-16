import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserRoleDto {
  @IsString()
  role: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  passwordHash: string;

  @IsString()
  fullName: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  @IsOptional()
  roles?: UserRoleDto[];
}
