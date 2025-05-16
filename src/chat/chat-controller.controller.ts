// import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { ChatServiceService } from './chat-service.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';


// @Controller('chat-controller')

// export class ChatControllerController {
//     constructor(private readonly chatService: ChatServiceService) {}

//     @Get('stream-token')
//     @UseGuards(JwtAuthGuard)
// async getStreamToken(@Req() req, @Res() res: Response) {
//   try {
//     const token = await this.chatService.getStreamToken(req.user.userId);
//     return res.status(200).json({ status: 'success', token });
//   } catch (error) {
//     return res.status(500).json({ status: 'error', message: error.message });
//   }
// }

// }


// src/chat/chat.controller.ts
import { BadRequestException, Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { StreamService } from '../stream/stream.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('chat-controller')
export class ChatController {
  constructor(private readonly streamService: StreamService) { }

  @UseGuards(JwtAuthGuard)
  @Get('stream-token')
  // async getStreamToken(@Request() req) {
  //   const user = req.user; // تأكدي إن فيه JWT أو session بيحط user
  //   if (!user?.id) {
  //     throw new BadRequestException('User ID is missing');
  //   }

  //   await this.streamService.upsertUser({
  //     id: user.id,
  //     name: user.name || 'Anonymous'
  //   });

  //   const token = this.streamService.generateToken(user.id);
  //   return { token };
  // }

  async getStreamToken(@Req() req, @Res() res: Response) {
    try {
      const token = await this.streamService.generateToken(req.user.userId);
      return res.status(200).json({ status: 'success', token });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

}
