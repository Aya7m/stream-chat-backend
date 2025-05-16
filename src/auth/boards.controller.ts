// src/auth/boards.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';


@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async OnBoards(@Body() user: any, @Req() req,@Res() res: Response) {
           
    
        // return await this.boardsService.OnBoards(req.user.userId, user.fullname, user.bio, user.nativeLanguage, user.learningLanguage, user.location, user.profilePic);

        return res.status(201).json({ message: 'User onboarded successfully' , user: await this.boardsService.OnBoards(req.user.userId, user.fullname, user.bio, user.nativeLanguage, user.learningLanguage, user.location, user.profilePic)});
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getUser(@Req() req) {
        

        return await this.boardsService.getUser(req.user.userId);
    }

}

