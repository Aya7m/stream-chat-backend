import { Module } from '@nestjs/common';
import { ChatController} from './chat-controller.controller';
import { ChatServiceService } from './chat-service.service';
import { FrendRequestSchema } from 'src/schemas/frend-request.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamModule } from 'src/stream/stream.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'FrendRequest', schema: FrendRequestSchema }]), StreamModule],
  controllers: [ChatController],
  providers: [ChatServiceService],
})
export class ChatModule {}
