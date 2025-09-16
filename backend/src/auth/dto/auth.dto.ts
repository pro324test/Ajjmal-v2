import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;
}

export class ValidateCredentialDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}