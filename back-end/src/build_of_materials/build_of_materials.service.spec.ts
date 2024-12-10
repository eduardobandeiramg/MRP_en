import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Material } from 'src/materials/entities/material.entity';
import { MaterialsService } from 'src/materials/materials.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { BuildOfMaterialsService } from './build_of_materials.service';
import { BuildOfMaterial } from './entities/build_of_material.entity';

describe('BuildOfMaterialsService', () => {
  let service: BuildOfMaterialsService;
  let buildOfMaterialsRepository: Repository<BuildOfMaterial>;

  const mockBuildOfMaterialsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockMaterialsService = {
    validateExistingMaterial: jest.fn(),
  };

  const mockProductsService = {
    validateExistingProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildOfMaterialsService,
        {
          provide: getRepositoryToken(BuildOfMaterial),
          useValue: mockBuildOfMaterialsRepository,
        },
        { provide: MaterialsService, useValue: mockMaterialsService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<BuildOfMaterialsService>(BuildOfMaterialsService);
    buildOfMaterialsRepository = module.get<Repository<BuildOfMaterial>>(
      getRepositoryToken(BuildOfMaterial),
    );
  });

  describe('create', () => {
    it('deve criar e salvar um BuildOfMaterial', async () => {
      const createDto = {
        productId: '123',
        materialId: '456',
        parentBuildOfMaterialId: '789',
        qtd: 10,
      };

      const product: Product = {
        id: '123',
        description: 'Test Product',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: '456',
        description: 'Test Material',
        code: 'M456',
        qtd: 100,
      };
      const parentBuildOfMaterial: BuildOfMaterial = {
        id: '789',
        lvl: 1,
        qtd: 10,
        product,
        material,
        parentBuildOfMaterial: null,
        childMaterials: [],
      };
      const buildOfMaterial: BuildOfMaterial = {
        id: 'abc',
        product,
        material,
        parentBuildOfMaterial,
        lvl: 2,
        qtd: 10,
        childMaterials: [],
      };

      jest
        .spyOn(service, 'validateCreate')
        .mockResolvedValue({ product, material, parentBuildOfMaterial });
      jest.spyOn(service, 'calculateLevel').mockResolvedValue(2);
      mockBuildOfMaterialsRepository.create.mockReturnValue(buildOfMaterial);
      mockBuildOfMaterialsRepository.save.mockResolvedValue(buildOfMaterial);

      await service.create(createDto);

      expect(service.validateCreate).toHaveBeenCalledWith(createDto);
      expect(service.calculateLevel).toHaveBeenCalledWith(
        parentBuildOfMaterial,
      );
      expect(mockBuildOfMaterialsRepository.create).toHaveBeenCalledWith({
        product,
        material,
        parentBuildOfMaterial,
        lvl: 2,
        qtd: 10,
      });
      expect(mockBuildOfMaterialsRepository.save).toHaveBeenCalledWith(
        buildOfMaterial,
      );
    });

    it('deve lançar InternalServerErrorException ao salvar falhar', async () => {
      const createDto = {
        productId: '123',
        materialId: '456',
        parentBuildOfMaterialId: '789',
        qtd: 10,
      };
      const product: Product = {
        id: '123',
        description: 'Test Product',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: '456',
        description: 'Test Material',
        code: 'M456',
        qtd: 100,
      };
      const parentBuildOfMaterial: BuildOfMaterial = {
        id: '789',
        lvl: 1,
        qtd: 10,
        product,
        material,
        parentBuildOfMaterial: null,
        childMaterials: [],
      };

      jest
        .spyOn(service, 'validateCreate')
        .mockResolvedValue({ product, material, parentBuildOfMaterial });
      jest.spyOn(service, 'calculateLevel').mockResolvedValue(2);
      mockBuildOfMaterialsRepository.create.mockReturnValue({});
      mockBuildOfMaterialsRepository.save.mockRejectedValue(new Error());

      await expect(service.create(createDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover o BuildOfMaterial e seus filhos recursivamente', async () => {
      const product: Product = {
        id: '123',
        description: 'Test Product',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: '456',
        description: 'Test Material',
        code: 'M456',
        qtd: 100,
      };

      const childBuildOfMaterial = {
        id: '456',
        childMaterials: [],
        product,
        material,
      } as BuildOfMaterial;
      const parentBuildOfMaterial = {
        id: '123',
        childMaterials: [childBuildOfMaterial],
        product,
        material,
      } as BuildOfMaterial;

      mockBuildOfMaterialsRepository.findOne
        .mockResolvedValueOnce(parentBuildOfMaterial)
        .mockResolvedValueOnce(childBuildOfMaterial);

      mockBuildOfMaterialsRepository.remove.mockResolvedValue(null);

      await service.remove('123');

      expect(mockBuildOfMaterialsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['childMaterials'],
      });

      expect(mockBuildOfMaterialsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '456' },
        relations: ['childMaterials'],
      });

      expect(mockBuildOfMaterialsRepository.remove).toHaveBeenCalledWith(
        childBuildOfMaterial,
      );
      expect(mockBuildOfMaterialsRepository.remove).toHaveBeenCalledWith(
        parentBuildOfMaterial,
      );
    });

    it('deve lançar NotFoundException se o BuildOfMaterial não for encontrado', async () => {
      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('123')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException se houver erro ao remover', async () => {
      const product: Product = {
        id: '123',
        description: 'Test Product',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: '456',
        description: 'Test Material',
        code: 'M456',
        qtd: 100,
      };
      const buildOfMaterial = {
        id: '123',
        childMaterials: [],
        product,
        material,
      } as BuildOfMaterial;

      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(buildOfMaterial);

      mockBuildOfMaterialsRepository.remove.mockRejectedValue(new Error());

      await expect(service.remove('123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getByProductAndLvl', () => {
    it('deve retornar os BuildOfMaterials pelo produto e nível', async () => {
      const buildOfMaterials = [{ id: '123', lvl: 1 }];
      const product: Product = {
        id: 'prod123',
        description: 'Product Test',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };

      mockProductsService.validateExistingProduct.mockResolvedValue(product);
      mockBuildOfMaterialsRepository.find.mockResolvedValue(buildOfMaterials);

      const result = await service.getByProductAndLvl('prod123', 1);

      expect(mockProductsService.validateExistingProduct).toHaveBeenCalledWith(
        'prod123',
      );
      expect(mockBuildOfMaterialsRepository.find).toHaveBeenCalledWith({
        where: { product, lvl: 1 },
        relations: ['material'],
      });
      expect(result).toEqual(buildOfMaterials);
    });

    it('deve retornar array vazio se nenhum BuildOfMaterial for encontrado', async () => {
      const product: Product = {
        id: 'prod123',
        description: 'Product Test',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };

      mockProductsService.validateExistingProduct.mockResolvedValue(product);

      mockBuildOfMaterialsRepository.find.mockResolvedValue([]);
      const result = await service.getByProductAndLvl('prod123', 1);

      expect(mockProductsService.validateExistingProduct).toHaveBeenCalledWith(
        'prod123',
      );
      expect(mockBuildOfMaterialsRepository.find).toHaveBeenCalledWith({
        where: { product, lvl: 1 },
        relations: ['material'],
      });
      expect(result).toEqual([]);
    });

    it('deve lançar NotFoundException se o produto não for encontrado', async () => {
      mockProductsService.validateExistingProduct.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.getByProductAndLvl('prod123', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar InternalServerErrorException se o repositório find falhar', async () => {
      const product: Product = {
        id: 'prod123',
        description: 'Product Test',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };

      mockProductsService.validateExistingProduct.mockResolvedValue(product);
      mockBuildOfMaterialsRepository.find.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getByProductAndLvl('prod123', 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getDirectChildren', () => {
    it('deve retornar os filhos diretos de um BuildOfMaterial', async () => {
      const product: Product = {
        id: '123',
        description: 'Test Product',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: '456',
        description: 'Test Material',
        code: 'M456',
        qtd: 100,
      };
      const buildOfMaterial = { id: '123', product, material };
      const children = [{ id: '456', product, material }];

      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(buildOfMaterial);
      mockBuildOfMaterialsRepository.find.mockResolvedValue(children);

      const result = await service.getDirectChildren('123');

      expect(mockBuildOfMaterialsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(mockBuildOfMaterialsRepository.find).toHaveBeenCalledWith({
        where: { parentBuildOfMaterial: { id: '123' } },
        relations: ['material'],
      });
      expect(result).toEqual(children);
    });

    it('deve lançar NotFoundException se o BuildOfMaterial não for encontrado', async () => {
      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(null);

      await expect(service.getDirectChildren('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateCreate', () => {
    it('deve validar o produto, material e parentBuildOfMaterial', async () => {
      const createDto = {
        productId: 'prod123',
        materialId: 'mat123',
        parentBuildOfMaterialId: 'bom123',
        qtd: 10,
      };
      const product: Product = {
        id: 'prod123',
        description: 'Product Test',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: 'mat123',
        description: 'Material Test',
        code: 'M123',
        qtd: 50,
      };
      const parentBuildOfMaterial: BuildOfMaterial = {
        id: 'bom123',
        lvl: 1,
        qtd: 10,
        product,
        material,
        parentBuildOfMaterial: null,
        childMaterials: [],
      };

      mockProductsService.validateExistingProduct.mockResolvedValue(product);
      mockMaterialsService.validateExistingMaterial.mockResolvedValue(material);
      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(
        parentBuildOfMaterial,
      );

      const result = await service.validateCreate(createDto);

      expect(mockProductsService.validateExistingProduct).toHaveBeenCalledWith(
        'prod123',
      );
      expect(
        mockMaterialsService.validateExistingMaterial,
      ).toHaveBeenCalledWith('mat123');
      expect(mockBuildOfMaterialsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'bom123' },
      });
      expect(result).toEqual({ product, material, parentBuildOfMaterial });
    });

    it('deve lançar NotFoundException se o parentBuildOfMaterial não for encontrado', async () => {
      const createDto = {
        productId: 'prod123',
        materialId: 'mat123',
        parentBuildOfMaterialId: 'bom123',
        qtd: 10,
      };
      const product: Product = {
        id: 'prod123',
        description: 'Product Test',
        code: 'P123',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      const material: Material = {
        id: 'mat123',
        description: 'Material Test',
        code: 'M123',
        qtd: 50,
      };

      mockProductsService.validateExistingProduct.mockResolvedValue(product);
      mockMaterialsService.validateExistingMaterial.mockResolvedValue(material);
      mockBuildOfMaterialsRepository.findOne.mockResolvedValue(null);

      await expect(service.validateCreate(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('calculateLevel', () => {
    it('deve retornar o nível 1 se não houver parentBuildOfMaterial', async () => {
      const lvl = await service.calculateLevel(null);
      expect(lvl).toBe(1);
    });

    it('deve retornar o nível do parentBuildOfMaterial + 1', async () => {
      const parentBuildOfMaterial = { id: '123', lvl: 2 } as BuildOfMaterial;
      const lvl = await service.calculateLevel(parentBuildOfMaterial);
      expect(lvl).toBe(3);
    });
  });
});
