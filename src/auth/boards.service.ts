// src/auth/boards.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { upsertStreamUser } from '../lib/stream';

@Injectable()
export class BoardsService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async OnBoards(userId: string, fullname: string, bio: string, nativeLanguage: string, learningLanguage: string, location: string, profilePic: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.fullname || !user.email || !user.password) {
            throw new Error('All fields are required');
        }

        




        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { fullname, bio, nativeLanguage, learningLanguage, location, profilePic, isOnboarded: true }, { new: true });

        if (!updatedUser) {
            throw new Error('User not found');
        }

       

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                image: updatedUser.profilePic
            });
            console.log(`User updated successfully ${updatedUser._id}`);

        } catch (error) {
            console.log(error);
        }
        return updatedUser;
    }


    // check if user is logged in


    async getUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
