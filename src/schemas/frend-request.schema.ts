import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class FrendRequest {

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    receiver: Types.ObjectId;
    

    @Prop({ enum: ['pending', 'accepted'], default: 'pending' })
    status: string;
}

export const FrendRequestSchema = SchemaFactory.createForClass(FrendRequest);
