import { Body, Controller, Post, Res } from '@nestjs/common';
import { SigninService } from './signin.service';
import { Response } from 'express';

@Controller('signin')
export class SigninController {
    constructor(private _SigninService: SigninService) { }
    @Post()
    async signin(@Body() user: any, @Res() res: Response) {
        try {
            const { token, user: userExists } = await this._SigninService.signin(user);

         

            return res.status(201).json({
                message: 'User signed in successfully',
                user: userExists,
                token
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

    }
}
