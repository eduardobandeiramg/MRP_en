import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateMaterialStockDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    qtd: number;
}
