import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SigninController } from './signin.controller';
import { SignupService } from './signup.service';
import { SigninService } from './signin.service';
import { LogoutService } from './logout.service';
import { LogoutController } from './logout.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';

import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtStrategy } from './jwt.strategy';


dotenv.config();


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),

  ],
  controllers: [SignupController, SigninController, LogoutController, BoardsController],
  providers: [SignupService, SigninService, LogoutService, BoardsService,JwtStrategy],
})
export class AuthModule { }
