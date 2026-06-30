import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  async signup(signupDto: SignupDto): Promise<{ success: boolean; message: string; accessToken: string; role?: string }> {
    const { email, password, role, isCorporateEntity, fullName, location, phone } = signupDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new this.userModel({
        role,
        isCorporateEntity,
        fullName,
        email,
        location,
        phone,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      
      // Create the data payload structure, encoded inside the JWT token
      const jwtPayload = { 
        sub: savedUser._id, 
        email: savedUser.email, 
        role: savedUser.role 
      };

      return {
        success: true,
        message: 'Account initialized successfully for CeylonWheels.',
        // Generate and sign the secure access token string
        accessToken: this.jwtService.sign(jwtPayload),
        role: savedUser.role,
      };
    } catch (error) {
      throw new InternalServerErrorException('Database failure processing registration records.');
    }
  }

  // login
  async login(loginDto: LoginDto): Promise<{ success: boolean; message: string; accessToken: string; role?: string }> {
    const { email, password } = loginDto;

    // Look up user by lowercase unique email index
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Throw generic 401 message for security obscurity (stops email harvesting)
      throw new UnauthorizedException('Invalid email credentials or password.');
    }

    // Compare the plain password string with the database-encrypted hash
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid email credentials or password.');
    }

    // Generate signed token signature structure containing safe metadata context
    const jwtPayload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      success: true,
      message: 'Authentication validated successfully.',
      accessToken: this.jwtService.sign(jwtPayload),
      role: user.role,
    };
  }
}