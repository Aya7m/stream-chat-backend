import { Controller, Get, Post, Put, Req, Res, UseGuards, Param } from '@nestjs/common';
import { UserControllerService } from './user-controller.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';


@Controller('user-controller')
@UseGuards(JwtAuthGuard)
export class UserControllerController {
    constructor(private readonly userControllerService: UserControllerService) { }


    @UseGuards(JwtAuthGuard)
    @Get('recommended-users')
    async getRecommendedUsers(@Req() req, @Res() res: Response) {
        // return await this.userControllerService.getRecommendedUsers(req.user.userId);
        const recommendedUsers = await this.userControllerService.getRecommendedUsers(req.user.userId);
        res.status(200).json({
            status: 'success',
            recommendedUsers: recommendedUsers,
        });
    }
    @UseGuards(JwtAuthGuard)
    @Get('my-friends')
    async getMyFriends(@Req() req, @Res() res: Response) {
        // return await this.userControllerService.getMyFriends(req.user.userId);

        const friends = await this.userControllerService.getMyFriends(req.user.userId);
        res.status(200).json({
            status: 'success',
            friends: friends,
        });
    }


    @UseGuards(JwtAuthGuard)
    @Post('send-request/:friendId')
    async sendRequest(
        @Req() req,
        @Param('friendId') friendId: string,
        @Res() res: Response
    ) {
        try {
            const request = await this.userControllerService.sendRequest(
                req.user.userId,
                friendId
            );

            res.status(201).json({
                status: 'success',
                request: request,
            });
        } catch (error) {
            console.error('Error in sendRequest:', error.message);

            res.status(400).json({
                status: 'error',
                message: error.message || 'Something went wrong',
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-request/:requestId')
    async acceptRequest(@Req() req, @Param('requestId') requestId: string, @Res() res: Response) {
        // return await this.userControllerService.acceptRequest(req.user.userId, requestId);
        const request = await this.userControllerService.acceptRequest(req.user.userId, requestId);
    
        res.status(201).json({
            status: 'success',
            request: request,
        });

    }


    @UseGuards(JwtAuthGuard)
    @Get('my-requests')
    async getMyRequests(@Req() req, @Res() res: Response) {
        // return await this.userControllerService.getMyRequests(req.user.userId);
        const myRequests = await this.userControllerService.getMyRequests(req.user.userId);
        res.status(200).json({
            status: 'success',
            myRequests: myRequests,
        });

    }


    @UseGuards(JwtAuthGuard)
    @Get('outgoing-requests')
    async getOutGoingFiendsRequests(@Req() req, @Res() res: Response) {
        // return await this.userControllerService.getOutGoingFiendsRequests(req.user.userId);
        const outgoingRequests = await this.userControllerService.getOutGoingFiendsRequests(req.user.userId);
        res.status(200).json({
            status: 'success',
            outgoingRequests: outgoingRequests,
        });
    }




}
