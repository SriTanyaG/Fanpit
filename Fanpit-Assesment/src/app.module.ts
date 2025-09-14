import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpaceModule } from './space/space.module';
import { UserModule } from './user/user.module';   
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PaymentModule } from './payment/payment.module';
import { EmailModule } from './email/email.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/fanpit'),
    SpaceModule,
    UserModule,
    AuthModule,
    CommentModule,
    PaymentModule,
    EmailModule,
    BookingModule,
  ],
})
export class AppModule {}