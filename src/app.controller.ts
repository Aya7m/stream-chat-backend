import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('test-cookie')
  testCookie(@Req() req: Request) {
    console.log('🍪 Cookies:', req.cookies);
    return {
      cookies: req.cookies,
    };
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
