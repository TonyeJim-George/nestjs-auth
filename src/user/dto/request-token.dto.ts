import { IsEmail, IsEnum, IsString } from "class-validator";
import { UserAccountStatus } from "src/user/enum/user.enum";

export class RequestTokenDto {

    @IsEmail()
    @IsString()
    email: string;
}