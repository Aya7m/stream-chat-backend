import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { upsertStreamUser } from '../lib/stream';





@Injectable()
export class SignupService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(user: User): Promise<{ token: string; user: User }> {
    if (!user.fullname || !user.email || !user.password) {
        throw new BadRequestException('All fields are required');

    }

    if (user.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new BadRequestException('Invalid email format');
    }

    const userExists = await this.userModel.findOne({ email: user.email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const indx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/10/${indx}.png`;
    user.profilePic = randomAvatar;

    const newUser = new this.userModel({
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      profilePic: user.profilePic,
    });

    //TO DO create  the user in stream
    try {
        await upsertStreamUser({
            id: newUser._id,
            email: newUser.email,
            name: newUser.fullname,
            image: newUser.profilePic ||""
        })
        console.log(`user ${newUser.fullname} created in stream`);
        
        
    } catch (error) {
        console.log("error in creating user in stream",error);
        
    }


    const token = this.jwtService.sign(
        { userId: newUser._id, username: newUser.fullname },
        { expiresIn: '30d' }
      );
      

    await newUser.save();

    return { token, user: newUser };
  }
}
