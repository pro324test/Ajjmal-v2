import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

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
}
