import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './providers/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
