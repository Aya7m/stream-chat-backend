import { Module } from '@nestjs/common';
import { UserControllerController } from './user-controller.controller';
import { UserControllerService } from './user-controller.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { FrendRequestSchema } from 'src/schemas/frend-request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'FrendRequest', schema: FrendRequestSchema }])],
  controllers: [UserControllerController],
  providers: [UserControllerService]
})
export class UserModule {}
