import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Space', required: true })
  space: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
