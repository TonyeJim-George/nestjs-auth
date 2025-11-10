import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';
import { OtpService } from 'src/otp/providers/otp.service';
import { OtpType } from 'src/otp/enum/otp.enum';
import { EmailService } from 'src/email/providers/email.service';
import { EmailVerification } from './email-verification';
import { RequestTokenDto } from '../dto/request-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly bcryptService: BcryptService,

        private readonly OtpService: OtpService,

        private readonly emailService: EmailService,

        private readonly emailVerification: EmailVerification,
    ) {}

    //register user
    async register(dto: UserDto): Promise<void> {

        const { email, password } = dto;

        //check if user already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await this.bcryptService.hashPassword(password);

        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
        });

        await this.userRepository.save(newUser);

        return this.emailVerification.emailVerification(newUser, OtpType.OTP)
    }

    //find by email
    async findByEmail(email: string): Promise<User | null>{
        return await this.userRepository.findOne({
            where: { email }
        })
    }

    async requestOtp(requestTokenDto: RequestTokenDto){
        const { email } = requestTokenDto;
    
        const user = await this.userRepository.findOne({
            where:{email}});
    
        if(!user){
            throw new NotFoundException('User not found');
        }
    
        //send otp
        await this.emailVerification.emailVerification(user, OtpType.OTP);
    
        return { message: 'OTP sent successfully. Please check email'};
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto){
        const { email } = forgotPasswordDto;

        const user = await this.userRepository.findOne({
            where: {email}
        });

        if(!user){
            throw new NotFoundException('User not found');
        }

        await this.emailVerification.emailVerification(user, OtpType.RESET_LINK);
        return {message: 'Password reset link has been sent. Please check your mail.'}




    }


}
