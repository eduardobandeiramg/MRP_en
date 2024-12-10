import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Production } from '../entities/production.entity';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ProductionStatus } from '../enums/status.enum';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
    @InjectRepository(ProductionPlan)
    private readonly productionPlanRepository: Repository<ProductionPlan>,
  ) {}

  async stopProduction(id: string): Promise<Production> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['product', 'productionPlan'],
    });

    if (!production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    production.status = ProductionStatus.AGUARDANDO_PECAS;

    return this.productionRepository.save(production);
  }

  async reestartProduction(id: string): Promise<Production> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['product', 'productionPlan'],
    });

    if (!production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    production.status = ProductionStatus.EM_PRODUCAO;

    return this.productionRepository.save(production);
  }

  async startProduction(id: string): Promise<Production> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['product', 'productionPlan'],
    });

    if (!production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    if (production.status !== ProductionStatus.A_PRODUZIR) {
      throw new BadRequestException(
        `Cannot start production. Current status is ${production.status}, expected status is A_PRODUZIR`,
      );
    }

    production.dateInit = new Date();
    production.status = ProductionStatus.EM_PRODUCAO;

    return this.productionRepository.save(production);
  }

  async endProduction(id: string): Promise<Production> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['product', 'productionPlan'],
    });

    if (!production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    if (production.status !== ProductionStatus.EM_PRODUCAO) {
      throw new BadRequestException(
        `Cannot finalize production. Current status is ${production.status}, expected status is EM_PRODUCAO`,
      );
    }

    production.dateEnd = new Date();
    production.status = ProductionStatus.FINALIZADO;

    return this.productionRepository.save(production);
  }

  async findProductsWithLessProductions(): Promise<ProductionPlan[]> {
    const productionPlans = await this.productionPlanRepository.find({
      relations: ['product', 'productions'],
    });

    return productionPlans
      .filter((plan) => plan.productions.length < plan.qtd)
      .sort(
        (a, b) =>
          new Date(a.datePrev).getTime() - new Date(b.datePrev).getTime(),
      );
  }

  async findProductsWithNullDates(): Promise<Production[]> {
    return this.productionRepository.find({
      where: { dateInit: null, dateEnd: null },
      relations: ['product', 'productionPlan'],
    });
  }

  async findProductsWithInitButNoEnd(): Promise<Production[]> {
    return this.productionRepository.find({
      where: { dateInit: Not(null), dateEnd: null },
      relations: ['product', 'productionPlan'],
    });
  }

  async findProductsToProduction(): Promise<Object[]> {
    const products = await this.productionRepository.find({
      where: { status: ProductionStatus.A_PRODUZIR },
      relations: ['product', 'productionPlan'],
    });

    const groupedData = products.reduce((acc, item) => {
      const productionPlan = item.productionPlan.id;
      if (!acc[productionPlan]) {
        acc[productionPlan] = {
          qtd: 0,
          status: item.status,
          product: item.product,
          productionIds: [],
          productionPlan: item.productionPlan,
        };
      }
      acc[productionPlan].productionIds.push(item.id);
      acc[productionPlan].qtd += 1;
      return acc;
    }, {});

    return Object.values(groupedData);
  }

  async findProductsOnProduction(): Promise<Object[]> {
    const products = await this.productionRepository.find({
      where: [
        { status: ProductionStatus.EM_PRODUCAO },
        { status: ProductionStatus.AGUARDANDO_PECAS },
      ],
      relations: ['product', 'productionPlan'],
    });
    const groupedData = products.reduce((acc, item) => {
      const key = `${item.status}_${item.productionPlan.id}`;
      if (!acc[key]) {
        acc[key] = {
          qtd: 0,
          status: item.status,
          product: item.product,
          productionIds: [],
          productionPlan: item.productionPlan,
        };
      }
      acc[key].productionIds.push(item.id);
      acc[key].qtd += 1;
      return acc;
    }, {});

    return Object.values(groupedData);
  }

  async findProductsFinishedProduction(): Promise<Object[]> {
    const products = await this.productionRepository.find({
      where: { status: ProductionStatus.FINALIZADO },
      relations: ['product', 'productionPlan'],
    });
    const groupedData = products.reduce((acc, item) => {
      const productionPlan = item.productionPlan.id;
      if (!acc[productionPlan]) {
        acc[productionPlan] = {
          qtd: 0,
          status: item.status,
          product: item.product,
          productionIds: [],
          productionPlan: item.productionPlan,
        };
      }
      acc[productionPlan].productionIds.push(item.id);
      acc[productionPlan].qtd += 1;
      return acc;
    }, {});

    return Object.values(groupedData);
  }

  async findProductionStatus(): Promise<Object[]> {
    const result = await this.productionRepository
      .createQueryBuilder('production')
      .leftJoin('production.product', 'product')
      .leftJoin('production.productionPlan', 'productionPlan')
      .select('product.code', 'producao')
      .addSelect('production.status', 'status')
      .addSelect('productionPlan.datePrev', 'datePrev')
      .addSelect('production.dateInit', 'dateInit')
      .where('production.status != :status', { status: ProductionStatus.FINALIZADO })
      .getRawMany();
    return Object.values(result);
  }

  async handleProductionPlanCreated(data: {
    id: string;
    productId: string;
    qtd: number;
  }) {
    const { id, productId, qtd } = data;

    for (let i = 0; i < qtd; i++) {
      const production = this.productionRepository.create({
        productionPlan: { id },
        product: { id: productId },
        status: ProductionStatus.A_PRODUZIR,
      });
      await this.productionRepository.save(production);
    }
  }

  async cancelProduction(productionId: string): Promise<Production> {
    try {
      const production = await this.productionRepository.findOne({
        where: { id: productionId },
      });

      if (!production) {
        throw new NotFoundException('Produção não encontrada');
      }

      if (
        production.status !== ProductionStatus.A_PRODUZIR &&
        production.status !== ProductionStatus.EM_PRODUCAO &&
        production.status !== ProductionStatus.AGUARDANDO_PECAS
      ) {
        throw new BadRequestException(
          'A produção não pode ser cancelada nesse status',
        );
      }

      production.status = ProductionStatus.CANCELADA;
      return await this.productionRepository.save(production);
    } catch (error) {
      throw new BadRequestException(
        `Erro ao cancelar a produção: ${error.message}`,
      );
    }
  }
}
