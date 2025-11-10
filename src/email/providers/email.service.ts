import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from '../dtos/email.dto';
import { from } from 'rxjs';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService
    ) {}

    emailTransport(){
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false, 
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
        return transporter;
    }

    async sendEmail(dto: SendEmailDto) {
        const {recipients, subject, html} = dto;

        const transport = this.emailTransport();

        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: recipients,
            subject: subject,
            html: html,
        };
        try{
            const result = await transport.sendMail(options);
            console.log('Email response: ', result);
        }
        catch (error) {
            console.log('Error sending email:', error);
        }

        //return from(transport.sendMail(options));
    }
}
