import { IsEmail, IsOptional, IsString } from "class-validator";

export class loginDto{
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    otp?: string;
}