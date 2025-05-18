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
        // if (!user.fullname || !user.email || !user.password! || !user.nativeLanguage || !user.learningLanguage || !user.location || !user.profilePic) {
        //     throw new Error('All fields are required');
        // }






        const updatedUser = await this.userModel.findByIdAndUpdate(userId,{
            fullname: fullname,
            bio: bio,
            nativeLanguage: nativeLanguage,
            learningLanguage: learningLanguage,
            location: location,
            profilePic: profilePic,
            isOnboarded: true
        }, { new: true  });
        if (!updatedUser) {
            throw new Error('User not found');
        }

        // Call the function to upsert the user in Stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image:updatedUser.profilePic || "",
                
                
            });
            console.log(`User upserted in Stream successfully: ${updatedUser._id}`);
        } catch (error) {
            console.error('Error upserting user in Stream:', error);
            throw new Error('Failed to upsert user in Stream');
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
