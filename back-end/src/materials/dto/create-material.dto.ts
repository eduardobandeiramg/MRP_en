import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength } from "class-validator";

export class CreateMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'code can only contain letters and numbers, no spaces or special characters.' })
    @MaxLength(8)
    code: string;
    
    @ApiProperty()
    @IsNotEmpty()
    description: string;
}
