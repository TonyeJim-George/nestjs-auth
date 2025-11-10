import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../otp.entity';
import { MoreThan, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { OtpType } from '../enum/otp.enum';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepository: Repository<Otp>,

        private readonly jwtService: JwtService,

        private readonly configService: ConfigService,
    ) {}

    async generateToken(user: User, type: OtpType) {

        if (type == OtpType.OTP) {
        const otpCode = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otpCode, 10);

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

        //Check if otp already exists for the
        const existingOtp = await this.otpRepository.findOne({
            where: { user: {id: user.id }, type },
        });

        if (existingOtp){
            //update existing token
            existingOtp.token = hashedOtp;
            existingOtp.expiresAt = expiresAt;
            await this.otpRepository.save(existingOtp);
        }   
        else{
            //create otp entity
            const otpEntity = this.otpRepository.create({
                user,
                token: hashedOtp,
                type,
                expiresAt,
            })  
            await this.otpRepository.save(otpEntity);  
            }
            return otpCode;
        } 

        else if(type === OtpType.RESET_LINK){
            const resetToken = this.jwtService.sign(
                {id: user.id, email: user.email},
                {
                    secret: this.configService.get<string>('JWT_RESET_SECRET'),
                    expiresIn: '15m',
                }
            );


            return resetToken;

        }
    }

    async validateOTP(userId: number, token: string): Promise<boolean>{
        const validToken = await this.otpRepository.findOne({
            where: {
                user: {id: userId},
                expiresAt: MoreThan(new Date()),
            }
        });

        if(!validToken){
            throw new BadRequestException("OTP is expired, request a new one.")
        }

        const isMatch = await bcrypt.compare(token, validToken.token);

        if(!isMatch){
            throw new BadRequestException('Invalid otp. Please try again')
        } 

        return true;
    }

    //validate reset password link
    async validateResetPassword(token: string){
        try{
            //verify the JWT token and decode it
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_RESET_SECRET')
            });

            //return the user id extracted from token if verification succeeds
            return decoded.id

        } catch(error){
            if(error?.name === 'TokenExpiredError'){
                throw new BadRequestException('The reset token has expired. Please request a new one',);
            }
            throw new BadRequestException('Invalid or malformed reset token')

        }
    }
}
