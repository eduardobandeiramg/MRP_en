import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductionPlanDto {
  @ApiProperty({ description: 'Quantidade planejada para a produção' })
  @IsNotEmpty()
  qtd: number;

  @ApiProperty({ description: 'Data prevista para a produção' })
  @IsNotEmpty()
  datePrev: string;

  @ApiProperty({
    description: 'ID do produto relacionado ao plano de produção',
  })
  @IsNotEmpty()
  productId: string;

  // Campos opcionais correspondentes ao entity ProductionPlan
  @ApiPropertyOptional({ description: 'ID da linha de produção' })
  @IsOptional()
  lineId?: string;
}
