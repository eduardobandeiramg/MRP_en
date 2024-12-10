import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class UpdateProductionDto {
  @ApiProperty({
    example: '2024-10-19',
    description: 'Data de início da produção',
    required: false,
  })
  @IsDateString()
  dateInit?: string;

  @ApiProperty({
    example: '2024-10-24',
    description: 'Data de término da produção',
    required: false,
  })
  @IsDateString()
  dateEnd?: string;
}
