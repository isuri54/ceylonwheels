import { Body, Controller, Get, Post, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 

@Controller('auth') // Route path base prefix: /api/v1/auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, 
  ) {}

  /**
   * POST Route Gateway handler for CeylonWheels user signup submissions
   * URI Access Path: http://localhost:3000/api/v1/auth/signup
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  /**
   * POST Route Gateway handler for user login submissions
   * URI Access Path: http://localhost:3000/api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * GET Authenticated User Profile
   * Route: http://localhost:3000/api/v1/auth/profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    // req.user is populated automatically by passport-jwt strategy
    const userId = req.user.id; 
    return await this.usersService.findProfile(userId);
  }
}