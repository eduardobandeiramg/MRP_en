import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Line } from 'src/line/entities/line.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ProductionPlansService } from '../production_plans/production_plans.service';

describe('ProductionPlansService', () => {
  let service: ProductionPlansService;
  let productionPlansRepository: Repository<ProductionPlan>;
  let productsRepository: Repository<Product>;
  let linesRepository: Repository<Line>;

  const mockProductionPlansRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
  const mockProductsRepository = {
    findOne: jest.fn(),
  };
  const mockLinesRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionPlansService,
        {
          provide: getRepositoryToken(ProductionPlan),
          useValue: mockProductionPlansRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(Line),
          useValue: mockLinesRepository,
        },
      ],
    }).compile();

    service = module.get<ProductionPlansService>(ProductionPlansService);
    productionPlansRepository = module.get<Repository<ProductionPlan>>(
      getRepositoryToken(ProductionPlan),
    );
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    linesRepository = module.get<Repository<Line>>(getRepositoryToken(Line));
  });

  describe('findOneById', () => {
    it('deve retornar um plano de produção pelo ID', async () => {
      const productionPlanId = '1';
      const mockProductionPlan: ProductionPlan = {
        id: productionPlanId,
        qtd: 10,
        datePrev: new Date('2024-06-15'),
        product: { id: 'product123', description: 'Product A' } as Product,
        line: { lineId: 'line123', name: 'Line A' } as Line,
        productions: [],
      };

      jest
        .spyOn(productionPlansRepository, 'findOne')
        .mockResolvedValue(mockProductionPlan);

      const result = await service.findOneById(productionPlanId);

      expect(productionPlansRepository.findOne).toHaveBeenCalledWith({
        where: { id: productionPlanId },
        relations: ['product'],
      });
      expect(result).toEqual(mockProductionPlan);
    });

    it('deve lançar um NotFoundException se o plano de produção não for encontrado', async () => {
      const productionPlanId = '2';
      jest.spyOn(productionPlansRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneById(productionPlanId)).rejects.toThrow(
        'Production Plan with ID 2 not found',
      );
    });
  });

  describe('remove', () => {
    it('deve remover um plano de produção pelo ID', async () => {
      const productionPlanId = '1';
      const mockProductionPlan: ProductionPlan = {
        id: productionPlanId,
        qtd: 10,
        datePrev: new Date('2024-06-15'),
        product: { id: 'product123', description: 'Product A' } as Product,
        line: { lineId: 'line123', name: 'Line A' } as Line,
        productions: [],
      };

      jest
        .spyOn(productionPlansRepository, 'findOne')
        .mockResolvedValue(mockProductionPlan);
      jest
        .spyOn(productionPlansRepository, 'delete')
        .mockResolvedValue(undefined);

      await service.remove(productionPlanId);

      expect(productionPlansRepository.findOne).toHaveBeenCalledWith({
        where: { id: productionPlanId },
      });
      expect(productionPlansRepository.delete).toHaveBeenCalledWith(
        productionPlanId,
      );
    });

    it('deve lançar um erro se o plano de produção não for encontrado para remoção', async () => {
      const productionPlanId = '2';
      jest.spyOn(productionPlansRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(productionPlanId)).rejects.toThrow(
        `ProductionPlan with id ${productionPlanId} not found`,
      );
    });
  });
});
