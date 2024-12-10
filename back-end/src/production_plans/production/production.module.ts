import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionPlan } from '../../production_plans/entities/production_plan.entity';
import { ProductsModule } from '../../products/products.module';
import { Production } from '../entities/production.entity';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { RabbitMQModule } from '../../rabbit/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Production, ProductionPlan]),
    ProductsModule,
    RabbitMQModule,
  ],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
