import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['brand_owner', 'attendee', 'admin'], default: 'attendee' })
  role: string;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
