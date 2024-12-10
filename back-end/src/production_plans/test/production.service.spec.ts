import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { CreateProductionDto } from '../dto/create-production.dto';
import { Production } from '../entities/production.entity';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ProductionStatus } from '../enums/status.enum';
import { ProductionService } from '../production/production.service';

describe('ProductionService', () => {
  let service: ProductionService;
  let productionRepository: Repository<Production>;
  let productRepository: Repository<Product>;
  let productionPlanRepository: Repository<ProductionPlan>;

  const mockProductionRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const mockProductRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const mockProductionPlanRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionService,
        {
          provide: getRepositoryToken(Production),
          useValue: mockProductionRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductionPlan),
          useValue: mockProductionPlanRepository,
        },
      ],
    }).compile();

    service = module.get<ProductionService>(ProductionService);
    productionRepository = module.get<Repository<Production>>(
      getRepositoryToken(Production),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productionPlanRepository = module.get<Repository<ProductionPlan>>(
      getRepositoryToken(ProductionPlan),
    );
  });

  describe('create', () => {
    it('deve criar uma nova produção com o DTO correto e retornar o resultado', async () => {
      const createProductionDto: CreateProductionDto = {
        productId: 'product123',
        productionPlanId: 'productionPlan123',
        dateInit: new Date().toISOString(),
        dateEnd: new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      const mockProduct = { id: 'product123' } as Product;
      const mockProductionPlan = { id: 'productionPlan123' } as ProductionPlan;

      const mockResult: Production = {
        id: '1',
        product: mockProduct,
        productionPlan: mockProductionPlan,
        dateInit: new Date(createProductionDto.dateInit),
        dateEnd: new Date(createProductionDto.dateEnd),
        status: ProductionStatus.A_PRODUZIR,
      } as Production;

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest
        .spyOn(productionPlanRepository, 'findOne')
        .mockResolvedValue(mockProductionPlan);
      jest.spyOn(productionRepository, 'save').mockResolvedValue(mockResult);

      const result = await service.create(createProductionDto);

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: createProductionDto.productId },
      });
      expect(productionPlanRepository.findOne).toHaveBeenCalledWith({
        where: { id: createProductionDto.productionPlanId },
      });
      expect(productionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          product: mockProduct,
          productionPlan: mockProductionPlan,
          dateInit: new Date(createProductionDto.dateInit),
          dateEnd: new Date(createProductionDto.dateEnd),
          status: ProductionStatus.A_PRODUZIR,
        }),
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('startProduction', () => {
    it('deve definir a data de início e atualizar o status para EM_PRODUCAO', async () => {
      const productionId = '1';
      const mockProduction: Production = {
        id: productionId,
        dateInit: null,
        dateEnd: null,
        status: ProductionStatus.A_PRODUZIR,
      } as Production;

      const updatedProduction = {
        ...mockProduction,
        dateInit: new Date(),
        status: ProductionStatus.EM_PRODUCAO,
      };

      jest
        .spyOn(productionRepository, 'findOne')
        .mockResolvedValue(mockProduction);
      jest
        .spyOn(productionRepository, 'save')
        .mockResolvedValue(updatedProduction);

      const result = await service.startProduction(productionId);

      expect(productionRepository.findOne).toHaveBeenCalledWith({
        where: { id: productionId },
        relations: ['product', 'productionPlan'],
      });
      expect(productionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          dateInit: expect.any(Date),
          status: ProductionStatus.EM_PRODUCAO,
        }),
      );
      expect(result).toEqual(updatedProduction);
    });
  });

  describe('endProduction', () => {
    it('deve definir a data de término e atualizar o status para FINALIZADO', async () => {
      const productionId = '1';
      const mockProduction: Production = {
        id: productionId,
        dateEnd: null,
        status: ProductionStatus.EM_PRODUCAO,
      } as Production;

      const updatedProduction = {
        ...mockProduction,
        dateEnd: new Date(),
        status: ProductionStatus.FINALIZADO,
      };

      jest
        .spyOn(productionRepository, 'findOne')
        .mockResolvedValue(mockProduction);
      jest
        .spyOn(productionRepository, 'save')
        .mockResolvedValue(updatedProduction);

      const result = await service.endProduction(productionId);

      expect(productionRepository.findOne).toHaveBeenCalledWith({
        where: { id: productionId },
        relations: ['product', 'productionPlan'],
      });
      expect(productionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          dateEnd: expect.any(Date),
          status: ProductionStatus.FINALIZADO,
        }),
      );
      expect(result).toEqual(updatedProduction);
    });
  });

  describe('findProductsWithLessProductions', () => {
    it('deve retornar planos de produção com menos produções do que o esperado', async () => {
      const mockProductionPlans = [
        {
          id: 'plan1',
          product: { id: 'product1', description: 'Produto A' },
          productions: [{ id: 'prod1', status: ProductionStatus.A_PRODUZIR }],
          qtd: 5,
          datePrev: new Date(),
        },
      ] as ProductionPlan[];

      jest
        .spyOn(productionPlanRepository, 'find')
        .mockResolvedValue(mockProductionPlans);

      const result = await service.findProductsWithLessProductions();

      // Verifica apenas as relações necessárias no serviço
      expect(productionPlanRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: expect.arrayContaining(['product', 'productions']),
        }),
      );

      expect(result).toEqual(
        mockProductionPlans.filter(
          (plan) => plan.productions.length < plan.qtd,
        ),
      );
    });
  });

  describe('findProductsWithNullDates', () => {
    it('deve retornar produções com data de início e término nulas', async () => {
      const mockProductions = [
        {
          id: 'prod1',
          product: {
            id: 'product1',
            name: 'Produto A',
            description: 'Descrição do Produto A',
            code: 'P001',
            isActive: true,
            productionPlans: [],
            productions: [],
          },
          productionPlan: {
            id: 'plan1',
            product: {
              id: 'product1',
              name: 'Produto A',
              description: 'Descrição do Produto A',
              code: 'P001',
              isActive: true,
              productionPlans: [],
              productions: [],
            },
            line: {
              lineId: 'line1',
              name: 'Linha A',
              productionPlans: [],
            },
            productions: [],
            qtd: 5,
            datePrev: new Date(),
          },
          dateInit: null,
          dateEnd: null,
          status: ProductionStatus.A_PRODUZIR,
        },
      ];

      jest
        .spyOn(productionRepository, 'find')
        .mockResolvedValue(mockProductions);

      const result = await service.findProductsWithNullDates();

      expect(productionRepository.find).toHaveBeenCalledWith({
        where: { dateInit: null, dateEnd: null },
        relations: ['product', 'productionPlan'],
      });
      expect(result).toEqual(mockProductions);
    });
  });

  describe('findProductsWithInitButNoEnd', () => {
    it('deve retornar produções com data de início definida e data de término nula', async () => {
      const mockProductions = [
        {
          id: 'prod1',
          product: {
            id: 'product1',
            name: 'Produto A',
            description: 'Descrição do Produto A',
            code: 'P001',
            isActive: true,
            productionPlans: [],
            productions: [],
          },
          productionPlan: {
            id: 'plan1',
            product: {
              id: 'product1',
              name: 'Produto A',
              description: 'Descrição do Produto A',
              code: 'P001',
              isActive: true,
              productionPlans: [],
              productions: [],
            },
            line: {
              lineId: 'line1',
              name: 'Linha A',
              productionPlans: [],
            },
            productions: [],
            qtd: 5,
            datePrev: new Date(),
          },
          dateInit: new Date(),
          dateEnd: null,
          status: ProductionStatus.EM_PRODUCAO,
        },
      ];

      jest
        .spyOn(productionRepository, 'find')
        .mockResolvedValue(mockProductions);

      const result = await service.findProductsWithInitButNoEnd();

      expect(productionRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            dateInit: expect.anything(), // Aceita o operador FindOperator
            dateEnd: null,
          },
          relations: ['product', 'productionPlan'],
        }),
      );
      expect(result).toEqual(mockProductions);
    });
  });
});
