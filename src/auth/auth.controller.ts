import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { loginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() dto:loginDto) {
        return this.authService.login(dto);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto ){
        return this.authService.resetPassword(resetPasswordDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() request){
        return{
            message: 'Welcome to profile',
            user: request.user //fetch user from request
        };
    }


}
