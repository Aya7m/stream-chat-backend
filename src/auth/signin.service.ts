import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SigninService {
     constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
      ) {}

      async signin(user: User): Promise<{ token: string; user: User }> {
        if (!user.email || !user.password) {
          throw new Error('All fields are required');
        }
    
        const userExists = await this.userModel.findOne({ email: user.email });
        if (!userExists) {
          throw new Error('User not found');
        }
    
        const isPasswordValid = await bcrypt.compare(user.password, userExists.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
    
        const token = this.jwtService.sign(
            { userId: userExists._id, username: userExists.fullname },
            { expiresIn: '30d' }
          );
          
    
        if (!token) {
          throw new Error('Failed to generate token');
        }
    
        return { token, user: userExists };
      }
}
