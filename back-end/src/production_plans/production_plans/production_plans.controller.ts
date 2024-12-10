import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductionPlansService } from '../../production_plans/production_plans/production_plans.service';
import { CreateProductionPlanDto } from '../dto/create-production_plan.dto';

@ApiTags('production-plans')
@ApiBearerAuth()
@Controller('production-plans')
export class ProductionPlansController {
  constructor(
    private readonly productionPlansService: ProductionPlansService,
  ) {}

  @Post()
  create(@Body() createProductionPlanDto: CreateProductionPlanDto) {
    return this.productionPlansService.create(createProductionPlanDto);
  }

  @Get('by-dates')
  async findByDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const productionPlans = await this.productionPlansService.findByDates(
        startDate,
        endDate,
      );
      if (!productionPlans || productionPlans.length === 0) {
        throw new NotFoundException(
          'No production plans found for the given dates',
        );
      }
      return productionPlans;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const productionPlan = await this.productionPlansService.findOneById(id);
      if (!productionPlan) {
        throw new NotFoundException(`Production Plan with ID ${id} not found`);
      }
      return productionPlan;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.productionPlansService.remove(id);
  }
}
