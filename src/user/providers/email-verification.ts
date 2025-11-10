import { Injectable } from '@nestjs/common';
import { OtpService } from 'src/otp/providers/otp.service';
import { User } from '../user.entity';
import { EmailService } from 'src/email/providers/email.service';
import { OtpType } from 'src/otp/enum/otp.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailVerification {
     constructor(
        
        private readonly otpService: OtpService,

        private readonly emailService: EmailService,

        private readonly configService: ConfigService,
     ){}

    async emailVerification(user: User, otpType:OtpType){
        const token = await this.otpService.generateToken(user, otpType);

        if (otpType === OtpType.OTP){
            const emailDto = {
                recipients: [user.email],
                subject: 'OTP for Account Verification',
                html: `Your otp code is: <strong>${token}</strong>.
                <br />Provide this code to verify your account.`,
            };

            //send otp via email
            return await this.emailService.sendEmail(emailDto);
        }

        else if(otpType === OtpType.RESET_LINK){
            const resetLink = `${this.configService.get('RESET_PASSWORD_URL')}?token=${token}`;
            const emailDto = {
                recipients: [user.email],
                subject: 'Password Reset Link',
                html: `Click the given link to reset your password: <p><a href="${resetLink}"> Reset Password </strong>`,
            };

            return await this.emailService.sendEmail(emailDto);

            // return { 
            //     user: newUser, 
            //     otp };
        }
}
}