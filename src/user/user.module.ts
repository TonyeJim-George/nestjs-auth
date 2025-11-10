import { Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './providers/user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { BcryptService } from './providers/bcrypt.service';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';
import { EmailVerification } from './providers/email-verification';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OtpModule, EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService, EmailVerification,],
  exports: [UserService, BcryptService],
})
export class UserModule {}

