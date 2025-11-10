import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendEmailDto {

    @IsEmail({}, {each: true})
    @IsNotEmpty()
    recipients: string[];

    @IsString()
    subject: string;

    @IsString()
    html?: string;

    @IsOptional()
    @IsString()
    text?: string;

}