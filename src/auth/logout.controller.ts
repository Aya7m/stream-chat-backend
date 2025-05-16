import { Controller, Post, Res } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { Response } from 'express';

@Controller('logout')
export class LogoutController {
    constructor(private readonly logoutService: LogoutService) {}

    @Post()
    logout(@Res() res: Response) {
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({ message: 'Logged out successfully' });
    }
}
