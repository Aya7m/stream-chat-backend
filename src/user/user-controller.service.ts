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
    // const user = await this.userModel.findById(userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }

    // const friend = await this.userModel.findById(friendId);
    // if (!friend) {
    //   throw new Error('Friend not found');
    // }

    // if (userId === friendId) {
    //   throw new Error('You cannot send request to yourself');
    // }

    // const requestExists = await this.frendRequestModel.findOne({
    //   sender: new Types.ObjectId(userId),
    //   receiver: new Types.ObjectId(friendId)
    // });
    // if (requestExists) {
    //   throw new Error('You have already sent request to this user');
    // }

    // const requestExists2 = await this.frendRequestModel.findOne({
    //   sender: new Types.ObjectId(friendId),
    //   receiver: new Types.ObjectId(userId)
    // });
    // if (requestExists2) {
    //   throw new Error('This user has already sent request to you');
    // }

    // const newRequest = new this.frendRequestModel({
    //   sender: new Types.ObjectId(userId),
    //   receiver: new Types.ObjectId(friendId)
    // });

    // const savedRequest = await newRequest.save();
    // return savedRequest;

    const senderId = new Types.ObjectId(userId);
    const receiverId = new Types.ObjectId(friendId);


    if (senderId === receiverId) {
      throw new Error('You cannot send request to yourself');
    }

    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      throw new Error('Receiver not found');
    }

    // Check if already friends
    if (receiver.friends.some(id => id.equals(senderId))) {
      throw new Error('You are already friends with this user');
    }



    // Check if the request already frinds
    if (receiver.friends.map(id => id.toString()).includes(senderId.toString())) {
      throw new Error('You are already friends with this user');
    }

    // Check if the request already send a request
    const requestExists = await this.frendRequestModel.findOne({
      $or: [
        { sender: new Types.ObjectId(senderId), receiver: new Types.ObjectId(receiverId) },
        { sender: new Types.ObjectId(receiverId), receiver: new Types.ObjectId(senderId) }
      ]
    });

    if (requestExists) {
      throw new Error('You have already sent request to this user');
    }

    // create a friend request

    const newRequest = new this.frendRequestModel({
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(receiverId)
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

    if (request.receiver.toString() !== user._id.toString()) {
      throw new Error('You are not authorized to accept this request');
    }

    // update the request status to accepted
    request.status = 'accepted';
    await request.save();

    // added each other to friends array
    await this.userModel.findByIdAndUpdate(user._id, {
      $addToSet: { friends: request.sender }
    });

    await this.userModel.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: user._id }
    });

    // return the updated request
    const updatedRequest = await this.frendRequestModel.findById(requestId);
    return updatedRequest;



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
    try {
      const incomingRequests = await this.frendRequestModel.find({
        receiver: new Types.ObjectId(userId), status: 'pending'
      }).populate('sender', 'fullname nativeLanguage learningLanguage profilePic');

      const outgoingRequests = await this.frendRequestModel.find({
        sender: new Types.ObjectId(userId),  status: 'pending'
      }).populate('receiver', 'fullname nativeLanguage learningLanguage profilePic');
      return {
        incomingRequests,
        outgoingRequests
      }

    } catch (error) {
      console.error('Error in getMyRequests:', error.message);
      throw new Error('Something went wrong');

    }

  }




  // get outGoingFiendsRequests
  async getOutGoingFiendsRequests(userId: string) {
    try {

      const outgoingRequests = await this.frendRequestModel.find({
        sender: new Types.ObjectId(userId),
        status: 'pending'
      }).populate('receiver', 'fullname nativeLanguage learningLanguage profilePic');

      return outgoingRequests;

    } catch (error) {
      console.error('Error in getOutGoingFiendsRequests:', error.message);
      throw new Error('Something went wrong');

    }
  }

}
