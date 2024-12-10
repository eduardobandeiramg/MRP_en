import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateProductionDto {
  @ApiProperty({ example: 'UUID do produto', description: 'ID do produto' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 'UUID do plano de produção',
    description: 'ID do plano de produção',
  })
  @IsUUID()
  productionPlanId: string;

}
