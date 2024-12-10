import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductionPlanDto } from '../dto/create-production_plan.dto';
import { ProductionPlan } from '../entities/production_plan.entity';
import { ProductionPlansController } from '../production_plans/production_plans.controller';
import { ProductionPlansService } from '../production_plans/production_plans.service';

describe('ProductionPlansController', () => {
  let controller: ProductionPlansController;
  let service: ProductionPlansService;

  const mockProductionPlansService = {
    create: jest.fn(),
    findByDates: jest.fn(),
    findOneById: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionPlansController],
      providers: [
        {
          provide: ProductionPlansService,
          useValue: mockProductionPlansService,
        },
      ],
    }).compile();

    controller = module.get<ProductionPlansController>(
      ProductionPlansController,
    );
    service = module.get<ProductionPlansService>(ProductionPlansService);
  });

  describe('create', () => {
    it('deve chamar o método create do serviço com o DTO correto', async () => {
      const createProductionPlanDto: CreateProductionPlanDto = {
        productId: '12345',
        qtd: 10,
        datePrev: new Date().toISOString(),
      };

      await controller.create(createProductionPlanDto);
      expect(service.create).toHaveBeenCalledWith(createProductionPlanDto);
    });
  });

  describe('findByDates', () => {
    it('deve chamar o método findByDates do serviço com as datas corretas', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      const mockResult: ProductionPlan[] = [
        {
          id: '1',
          qtd: 10,
          datePrev: new Date(startDate),
          product: { id: 'product123', description: 'Product A' } as any,
          line: { lineId: 'line123', name: 'Line A' } as any,
          productions: [],
        } as ProductionPlan,
      ];

      jest.spyOn(service, 'findByDates').mockResolvedValue(mockResult);

      const result = await controller.findByDates(startDate, endDate);

      expect(service.findByDates).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('deve chamar o método findOneById do serviço com o ID correto', async () => {
      const productionPlanId = '1';
      const mockProductionPlan: ProductionPlan = {
        id: productionPlanId,
        qtd: 10,
        datePrev: new Date('2024-06-15'),
        product: { id: 'product123', description: 'Product A' } as any,
        line: { lineId: 'line123', name: 'Line A' } as any,
        productions: [],
      } as ProductionPlan;

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockProductionPlan);

      const result = await controller.findOne(productionPlanId);

      expect(service.findOneById).toHaveBeenCalledWith(productionPlanId);
      expect(result).toEqual(mockProductionPlan);
    });
  });

  describe('remove', () => {
    it('deve chamar o método remove do serviço com o ID correto', async () => {
      const productionPlanId = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(productionPlanId);

      expect(service.remove).toHaveBeenCalledWith(productionPlanId);
    });
  });
});
