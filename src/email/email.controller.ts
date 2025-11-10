import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './providers/email.service';
import { SendEmailDto } from './dtos/email.dto';

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService
    ) {}

    @Post('send')
    async sendMail(@Body() dto: SendEmailDto) {
        await this.emailService.sendEmail(dto);
        return { message: 'Email sent successfully' };
    }
}
