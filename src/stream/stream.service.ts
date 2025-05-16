// src/stream/stream.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class StreamService implements OnModuleInit {
  private streamClient: StreamChat;

  onModuleInit() {
    const apiKey = process.env.STREAM_KEY;
    const apiSecret = process.env.STREAM_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Missing Stream API Key or Secret');
    }

   this.streamClient = new StreamChat(apiKey, apiSecret);

  }

async upsertUser(userData: { id: string; name: string }) {
  if (!userData?.id) {
    throw new Error('User ID is required');
  }

  return await this.streamClient.upsertUsers([userData]);
}


  generateToken(userId: string) {
    try {
      return this.streamClient.createToken(userId);
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }
}
