import { Test, TestingModule } from '@nestjs/testing';
import { BuildOfMaterialsController } from './build_of_materials.controller';
import { BuildOfMaterialsService } from './build_of_materials.service';
import { CreateBuildOfMaterialDto } from './dto/create-build_of_material.dto';

describe('BuildOfMaterialsController', () => {
  let controller: BuildOfMaterialsController;
  let service: BuildOfMaterialsService;

  const mockService = {
    create: jest.fn(),
    remove: jest.fn(),
    getByProductAndLvl: jest.fn(),
    getDirectChildren: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildOfMaterialsController],
      providers: [
        {
          provide: BuildOfMaterialsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BuildOfMaterialsController>(BuildOfMaterialsController);
    service = module.get<BuildOfMaterialsService>(BuildOfMaterialsService);
  });

  describe('create', () => {
    it('deve chamar o service.create com o DTO correto', async () => {
      const createDto: CreateBuildOfMaterialDto = {
        productId: '123', materialId: '456', parentBuildOfMaterialId: '789',
        qtd: 1
      };
      await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('remove', () => {
    it('deve chamar o service.remove com o id correto', async () => {
      const id = 'abc123';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('getBuildOfMaterialsByProduct', () => {
    it('deve chamar o service.getByProductAndLvl com o productId correto e lvl = 1', async () => {
      const productId = 'prod123';
      await controller.getBuildOfMaterialsByProduct(productId);
      expect(service.getByProductAndLvl).toHaveBeenCalledWith(productId, 1);
    });
  });

  describe('getDirectChildren', () => {
    it('deve chamar o service.getDirectChildren com o buildOfMaterialId correto', async () => {
      const buildOfMaterialId = 'bom456';
      await controller.getDirectChildren(buildOfMaterialId);
      expect(service.getDirectChildren).toHaveBeenCalledWith(buildOfMaterialId);
    });
  });
});
