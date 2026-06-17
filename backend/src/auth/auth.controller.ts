import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Sets up route path base prefix: /api/v1/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST Route Gateway handler for CeylonWheels user signup submissions
   * URI Access Path: http://localhost:3000/api/v1/auth/signup
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // Explicitly responds with standard 201 Created state code
  async signup(@Body() signupDto: SignupDto) {
    // Validation pipes intercept incoming request right here using SignupDto constraints
    return await this.authService.signup(signupDto);
  }

  /**
   * POST Route Gateway handler for user login submissions
   * URI Access Path: http://localhost:3000/api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Explicitly responds with standard 200 OK state code
  async login(@Body() loginDto: LoginDto) {
    // Validation pipes intercept incoming request right here using LoginDto constraints
    return await this.authService.login(loginDto);
  }
}