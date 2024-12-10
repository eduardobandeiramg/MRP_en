import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateLineDto {
    @ApiProperty({ description: 'Name of the line', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}