import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line } from '../../line/entities/line.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateProductionPlanDto } from '../dto/create-production_plan.dto';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Production } from '../entities/production.entity';

@Injectable()
export class ProductionPlansService {
  constructor(
    @InjectRepository(ProductionPlan)
    private productionPlansRepository: Repository<ProductionPlan>,
    @InjectRepository(Production)
    private productionsRepository: Repository<Production>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Line)
    private linesRepository: Repository<Line>,
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async create(createProductionPlanDto: CreateProductionPlanDto) {
    const { qtd, datePrev, productId, lineId } = createProductionPlanDto;

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    const line = await this.linesRepository.findOne({
      where: { lineId: lineId },
    });

    const productionPlan = new ProductionPlan();
    productionPlan.qtd = qtd;

    const [year, month, day] = datePrev.split('-').map(Number);
    productionPlan.datePrev = new Date(year, month - 1, day);
    if (isNaN(productionPlan.datePrev.getTime())) {
      throw new Error('Invalid date value provided for datePrev');
    }

    productionPlan.product = product;
    productionPlan.line = line;

    const savedPlan = await this.productionPlansRepository.save(productionPlan);

    this.client.emit('production_plan_created', {
      id: savedPlan.id,
      qtd: savedPlan.qtd,
      datePrev: savedPlan.datePrev,
      productId
    });

    return savedPlan;
  }

  async findByDates(startDate: string, endDate: string) {
    try {
      const query = this.productionPlansRepository
        .createQueryBuilder('productionPlan')
        .leftJoinAndSelect('productionPlan.product', 'product')
        .leftJoinAndSelect('productionPlan.line', 'line');

      if (startDate) {
        query.andWhere('productionPlan.datePrev >= :startDate', { startDate });
      }

      if (endDate) {
        query.andWhere('productionPlan.datePrev <= :endDate', { endDate });
      }

      const productionPlans = await query.getMany();

      if (productionPlans.length === 0) {
        throw new NotFoundException(
          'No production plans found between the given dates.',
        );
      }

      return productionPlans;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async findOneById(id: string) {
    try {
      const productionPlan = await this.productionPlansRepository.findOne({
        where: { id },
        relations: ['product'],
      });
      if (!productionPlan) {
        throw new NotFoundException(`Production Plan with ID ${id} not found`);
      }
      return productionPlan;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const productionPlan = await this.productionPlansRepository.findOne({
      where: { id },
      relations: ['productions'],
    });

    if (!productionPlan) {
      throw new Error(`ProductionPlan with id ${id} not found`);
    }

    for (const child of productionPlan.productions) {
      await this.productionsRepository.delete(child.id);
    }

    await this.productionPlansRepository.delete(id);
  }
}
