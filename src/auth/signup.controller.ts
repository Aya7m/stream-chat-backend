import { Controller, Post, Body, Res } from '@nestjs/common';
import { SignupService } from './signup.service';
import { Response } from 'express';


@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post()
  async signup(@Body() user: any, @Res() res: Response) {
    try {
      const { token, user: newUser } = await this.signupService.create(user);

      
      
      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
        token,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}
