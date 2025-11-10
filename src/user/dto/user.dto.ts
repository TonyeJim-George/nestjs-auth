import { IsEmail, IsEnum, IsString } from "class-validator";
import { UserAccountStatus } from "src/user/enum/user.enum";

export class UserDto {

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsEnum(UserAccountStatus)
    accountStatus: UserAccountStatus;
}