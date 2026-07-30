import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService // Inject ConfigService here
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Reads dynamically from .env
    });
  }

  // Once validated, this payload is injected into NestJS's execution context as "req.user"
  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userModel.findById(payload.sub).select('-password');
    
    if (!user) {
      throw new UnauthorizedException('Session expired or user profile no longer exists.');
    }
    
    return {
      id: user._id ? user._id.toString() : payload.sub, // Fallback to payload.sub if _id conversion acts up
      email: user.email,
      location: user.location,
    }; 
  }
}