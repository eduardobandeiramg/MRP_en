import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { ClientRole } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ enum: ClientRole, enumName: 'ClientRole' })
    @IsNotEmpty()
    role: ClientRole

}
