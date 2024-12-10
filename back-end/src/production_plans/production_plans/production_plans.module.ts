import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineModule } from '../../line/line.module';
import { ProductionPlansService } from '../../production_plans/production_plans/production_plans.service';
import { ProductsModule } from '../../products/products.module';
import { Production } from '../entities/production.entity';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ProductionPlansController } from './production_plans.controller';
import { RabbitMQModule } from '../../rabbit/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionPlan, Production]),
    LineModule,
    ProductsModule,
    Production,
    RabbitMQModule,
  ],
  controllers: [ProductionPlansController],
  providers: [ProductionPlansService],
})
export class ProductionPlansModule {}
