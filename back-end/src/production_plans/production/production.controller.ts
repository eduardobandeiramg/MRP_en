import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductionService } from './production.service';

@ApiTags('production')
@ApiBearerAuth()
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Patch(':id/start')
  @ApiOperation({ summary: 'Inicia a produção e coloca no status EM_PRODUCAO' })
  startProduction(@Param('id') id: string) {
    return this.productionService.startProduction(id);
  }

  @Patch(':id/end')
  @ApiOperation({
    summary: 'Finaliza a produção e coloca no status FINALIZADO',
  })
  endProduction(@Param('id') id: string) {
    return this.productionService.endProduction(id);
  }

  @Patch('stop-production')
  @ApiOperation({
    summary:
      'Para a produção, colocando no status AGUARDANDO_PECAS, para solicitar peças ao estoque',
  })
  async sendRequestToStock(@Query('productionId') productionId: string) {
    return this.productionService.stopProduction(productionId);
  }

  @Patch('reestart-production')
  @ApiOperation({
    summary: 'Retorna status para EM_PRODUCAO',
  })
  async reestartProduction(@Query('productionId') productionId: string) {
    return this.productionService.reestartProduction(productionId);
  }

  @Get('less-productions')
  @ApiOperation({
    summary:
      'Busca produtos que possuem menos produções que a quantidade definida no plano de produção',
  })
  findProductsWithLessProductions() {
    return this.productionService.findProductsWithLessProductions();
  }

  @Get('null-dates')
  @ApiOperation({
    summary: 'Busca todas as produções com data de início e fim nulas',
  })
  findProductsWithNullDates() {
    return this.productionService.findProductsWithNullDates();
  }

  @Get('init-no-end')
  @ApiOperation({
    summary:
      'Busca todas as produções com data de início existente e data de fim nula',
  })
  findProductsWithInitButNoEnd() {
    return this.productionService.findProductsWithInitButNoEnd();
  }

  @Get('to-production')
  @ApiOperation({
    summary: 'Busca dados dos produtos para produzir',
  })
  findProductsToProduction() {
    return this.productionService.findProductsToProduction();
  }

  @Get('on-production')
  @ApiOperation({
    summary: 'Busca dados dos produtos em produção',
  })
  findProductsOnProduction() {
    return this.productionService.findProductsOnProduction();
  }

  @Get('finished-production')
  @ApiOperation({
    summary: 'Busca dados dos produtos finalizados',
  })
  findProductsFinishedProduction() {
    return this.productionService.findProductsFinishedProduction();
  }

  @Get('status-production')
  @ApiOperation({
    summary:
      'Busca dados do status dos produtos a produzir',
  })
  findProductionStatus() {
    return this.productionService.findProductionStatus();
  }

  @EventPattern('production_plan_created')
  handleProductionPlanCreated(data: any) {
    this.productionService.handleProductionPlanCreated(data);
  }

  @Patch(':id/cancel')
  async cancelProduction(@Param('id') id: string) {
    return this.productionService.cancelProduction(id);
  }
}
