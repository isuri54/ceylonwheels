import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password field cannot be submitted blank.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password!: string;
}