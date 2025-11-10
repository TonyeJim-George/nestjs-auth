import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserDto } from './dto/user.dto';
import { RequestTokenDto } from './dto/request-token.dto';
import { EmailVerification } from './providers/email-verification';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,

        private readonly emailVerification: EmailVerification
    ) {}

    @Post('register')
    async register(@Body() userDto: UserDto) {
        await this.userService.register(userDto);
        return { message: 'User created successfully and OTP sent to email',
            email: userDto.email,
         };
    }

    @Post('request-otp')
    async requestOtp(@Body() requesTokenDto: RequestTokenDto){
        return await this.userService.requestOtp(requesTokenDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
        return await this.userService.forgotPassword(forgotPasswordDto)
    }

}
