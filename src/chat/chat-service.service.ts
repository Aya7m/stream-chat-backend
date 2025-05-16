import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateStreamToken } from '../lib/stream';
import { FrendRequest } from 'src/schemas/frend-request.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ChatServiceService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('FrendRequest') private readonly frendRequestModel: Model<FrendRequest>) { }

    // generate stream token

    async getStreamToken(userId: string): Promise<string> {
        try {
          const token = generateStreamToken(userId);
          if (!token || typeof token !== 'string') {
            throw new Error("Generated token is invalid");
          }
          return token;
        } catch (error) {
          console.error("Error generating Stream token:", error);
          throw new Error("Failed to generate stream token"); // throw error عشان الفرونت يعرف يتعامل
        }
      }
      
}
