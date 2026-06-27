import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Finds a user by ID and returns profile fields including the nested location object
   */
  async findProfile(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('fullName email phone location')
      .exec();

    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }
}