import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLineDto {
    @ApiProperty({ description: 'Name of the line' })
    @IsString()
    @IsNotEmpty()
    name: string;
}