import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBuildOfMaterialDto {

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    qtd: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    materialId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    parentBuildOfMaterialId: string;

}
