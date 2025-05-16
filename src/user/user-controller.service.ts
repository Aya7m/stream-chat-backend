import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { FrendRequest } from 'src/schemas/frend-request.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserControllerService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('FrendRequest') private readonly frendRequestModel: Model<FrendRequest>) { }

    //    get  recommended users

    async getRecommendedUsers(userId: string) {
        const curentUserId = userId;
        const user = await this.userModel.findById(curentUserId);
        if (!user) {
            throw new Error('User not found');
        }
        const recommendedUsers = await this.userModel.find({
            $and: [{ _id: { $ne: user._id } }, { friends: { $nin: [user._id] } }, { isOnboarded: true }]
        });
        return recommendedUsers;

    }

    // get my friends
    async getMyFriends(userId: string) {
        const user = await this.userModel.findById(userId).select('friends').
            populate('friends', 'fullname nativeLanguage learningLanguage profilePic');

        if (!user) {
            throw new Error('User not found');
        }
        return user.friends;


    }


    // send request to friend

    async sendRequest(userId: string, friendId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
      
        const friend = await this.userModel.findById(friendId);
        if (!friend) {
          throw new Error('Friend not found');
        }
      
        if (userId === friendId) {
          throw new Error('You cannot send request to yourself');
        }
      
        const requestExists = await this.frendRequestModel.findOne({
          sender: new Types.ObjectId(userId),
          receiver: new Types.ObjectId(friendId)
        });
        if (requestExists) {
          throw new Error('You have already sent request to this user');
        }
      
        const requestExists2 = await this.frendRequestModel.findOne({
          sender: new Types.ObjectId(friendId),
          receiver: new Types.ObjectId(userId)
        });
        if (requestExists2) {
          throw new Error('This user has already sent request to you');
        }
      
        const newRequest = new this.frendRequestModel({
          sender: new Types.ObjectId(userId),
          receiver: new Types.ObjectId(friendId)
        });
      
        const savedRequest = await newRequest.save();
        return savedRequest;
      }
      
    

    // accept request
    async acceptRequest(userId: string, requestId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const request = await this.frendRequestModel.findById(requestId);
        if (!request) {
            throw new Error('Request not found');
        }
        if (request.receiver.toString() !== userId) {
            throw new Error('You are not the receiver of this request');
        }
        request.status = 'accepted';
        //   add each user to the other's friend array
        await this.userModel.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
        await this.userModel.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });
        const savedRequest = await request.save();
        return savedRequest;

    }

    // get friends requests


    // async getMyRequests(userId: string) {
    //     const user = await this.userModel.findById(userId);
    //     if (!user) {
    //         throw new Error('User not found');
    //     }
    
    //     const incomingRequests = await this.frendRequestModel.find({
    //         receiver: new Types.ObjectId(userId), 
    //         status: 'pending'
    //     }).populate('sender', 'fullname nativeLanguage learningLanguage profilePic');
    
    //     console.log('All Pending Requests:', incomingRequests);
    
    //     const outgoingRequests = await this.frendRequestModel.find({
    //         sender: new Types.ObjectId(userId), 
    //         status: 'accepted'
    //     }).populate('receiver', 'fullname nativeLanguage learningLanguage profilePic');
    
    //     console.log('Outgoing Requests:', outgoingRequests);
    
    //     return {
    //         incomingRequests,
    //         outgoingRequests
    //     };
    // }



    async getMyRequests(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
      
        const incomingRequests = await this.frendRequestModel.find({
          receiver: new Types.ObjectId(userId),
          status: 'pending'
        }).populate('sender', 'fullname nativeLanguage learningLanguage profilePic');
      
        const outgoingRequests = await this.frendRequestModel.find({
          sender: new Types.ObjectId(userId),
          status: 'pending' // ← هنا التعديل
        }).populate('receiver', 'fullname nativeLanguage learningLanguage profilePic');
      
        return {
          incomingRequests,
          outgoingRequests
        };
      }
      
    


    // get outGoingFiendsRequests
    async getOutGoingFiendsRequests(userId: string) {
        const outgoingRequests = await this.frendRequestModel.find({
            sender: userId, status: 'pending'
        }).populate('receiver', 'fullname nativeLanguage learningLanguage profilePic');
        return outgoingRequests;
    }

}
