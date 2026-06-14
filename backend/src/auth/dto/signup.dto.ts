import { IsEmail, IsEnum, IsBoolean, IsNotEmpty, IsString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  @IsNotEmpty()
  town!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;
}

export class SignupDto {
  @IsEnum(['customer', 'renter'])
  role!: string; 

  @IsBoolean()
  isCorporateEntity!: boolean;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto; 

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}