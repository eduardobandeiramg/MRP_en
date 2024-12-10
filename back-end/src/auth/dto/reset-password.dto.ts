import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    resetToken: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}