import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDto } from '../dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/user/providers/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { UserAccountStatus } from 'src/user/enum/user.enum';
import { OtpService } from 'src/otp/providers/otp.service';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly bcryptService: BcryptService,

        private readonly jwtService: JwtService,

        private readonly otpService: OtpService,
    ){}

    async login(dto: loginDto){
        try{

            const { email, password, otp } = dto;
            //check if the user exists
            const user = await this.userRepository.findOne(
                {
                    where: { email }
                }
            )

            if (!user){
                throw new UnauthorizedException("Email doesn't exist")
            }

            const passwordMatch = await this.bcryptService.comparePassword(password, user.password)

            if(!passwordMatch){
                throw new UnauthorizedException('Invalid credentials');
            }

                // check if user is already active but otp was provided
            if (user.accountStatus === UserAccountStatus.ACTIVE && otp) {
            throw new BadRequestException('Your account is already verified; OTP is not required.');
            }

            if (user.accountStatus === UserAccountStatus.INACTIVE){
                if(!otp){
                    return {
                        message: 'Your account is not verified. Please provide your otp to verify',
                    };
                }
                else{
                    await this.verifyToken(user.id, otp);
                }
            }

            //generate a jwt token
            const payload = { id: user.id, email: user.email };
            const accessToken= this.jwtService.sign(payload);

            return {
                accessToken,
                userId: user.id,
                email: user.email,
            };
        }
        catch(error){

            if(error instanceof UnauthorizedException || 
                error instanceof BadRequestException
            ){
                throw error;
            }
            throw new BadRequestException('login failed')

        }
    }

    async verifyToken(userId: number, token: string){
        await this.otpService.validateOTP(userId, token);

        const user = await this.userRepository.findOne({
            where: {id: userId}
        });

        if(!user){
            throw new UnauthorizedException('User not found');
        }

        //if otp is valid, account is verified
        user.accountStatus = UserAccountStatus.ACTIVE;

        return await this.userRepository.save(user);


    }

    //service for reset password
    async resetPassword(resetPasswordDto:ResetPasswordDto): Promise<string>{
        const userId = await this.otpService.validateResetPassword(resetPasswordDto.token)

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })
        if (!user){
            throw new BadRequestException('User not found');
        }

        //hash the new password and update their user

        user.password = await this.bcryptService.hashPassword(resetPasswordDto.newPassword);
        await this.userRepository.save(user);

        return 'Password reset successfully';



    }
}
