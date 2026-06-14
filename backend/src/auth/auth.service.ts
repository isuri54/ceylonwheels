import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt'; //
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  async signup(signupDto: SignupDto): Promise<{ success: boolean; message: string; accessToken: string }> {
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
      };
    } catch (error) {
      throw new InternalServerErrorException('Database failure processing registration records.');
    }
  }
}