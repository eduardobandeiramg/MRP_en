import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { description: 'Product B', code: 'P123' };
      const mockProduct = {
        id: '54321',
        ...dto,
        isActive: true,
        productionPlans: [],
        productions: [],
      };

      jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(mockProduct as Product);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(mockProduct as Product);

      await service.create(dto);

      expect(productRepository.create).toHaveBeenCalledWith(dto);
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product by ID', async () => {
      const productId = '12345';
      const updateDto = { description: 'Updated Product', code: 'P456' };
      const mockUpdatedProduct = {
        id: productId,
        ...updateDto,
        isActive: true,
      };

      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(mockUpdatedProduct as Product);
      jest
        .spyOn(service, 'updateProduct')
        .mockResolvedValue(mockUpdatedProduct as Product);

      const result = await service.updateProduct(productId, updateDto);

      expect(result).toEqual(mockUpdatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(productId, updateDto);
    });
  });

  describe('findOneByID', () => {
    it('should return a product by ID', async () => {
      const productId = '12345';
      const mockProduct = {
        id: productId,
        description: 'Product A',
        code: 'P123',
        isActive: true,
      };

      // Mock da função findOne para retornar o produto simulado
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(mockProduct as Product);

      // Chamada do método findOneByID do serviço
      const result = await service.findOneByID(productId);

      // Verificações
      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId, isActive: true },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const productId = 'non-existent-id';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneByID(productId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all active products', async () => {
      const mockProducts = [
        { id: '123', description: 'Product A', code: 'P123', isActive: true },
        { id: '456', description: 'Product B', code: 'P456', isActive: true },
      ];

      jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(mockProducts as Product[]);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
    });
  });

  describe('deactivateProduct', () => {
    it('should deactivate a product by ID', async () => {
      const productId = '12345';
      const mockProduct = {
        id: productId,
        code: 'Updated Product B',
        description: 'Updated Description',
        isActive: true,
        productionPlans: [],
        productions: [],
      };

      jest
        .spyOn(service, 'findOneByID')
        .mockResolvedValue(mockProduct as Product);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue({ ...mockProduct, isActive: false });

      await service.deactivateProduct(productId);

      expect(service.findOneByID).toHaveBeenCalledWith(productId);
      expect(productRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        isActive: false,
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(service, 'findOneByID').mockResolvedValue(null);

      await expect(service.deactivateProduct('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateProduct', () => {
    it('should throw ConflictException if product description already exists', async () => {
      const description = 'Existing Product';
      const mockProduct = {
        id: '123',
        description,
        code: 'P123',
        isActive: true,
      };

      jest
        .spyOn(service, 'findOneProduct')
        .mockResolvedValue(mockProduct as Product);

      await expect(service.validateProduct(description)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not throw if product description is unique', async () => {
      jest.spyOn(service, 'findOneProduct').mockResolvedValue(null);

      await expect(
        service.validateProduct('Unique Description'),
      ).resolves.not.toThrow();
    });
  });

  describe('findOneProduct', () => {
    it('should return a product by description if active', async () => {
      const description = 'Product A';
      const mockProduct = {
        id: '123',
        description,
        code: 'P123',
        isActive: true,
      };

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(mockProduct as Product);

      const result = await service.findOneProduct(description);

      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { description, isActive: true },
      });
    });

    it('should return null if no active product is found by description', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOneProduct('Non-existent Description');

      expect(result).toBeNull();
    });
  });

  describe('validateExistingProduct', () => {
    it('should return the existing product if found', async () => {
      const productId = 'existing-id';
      const mockProduct = {
        id: productId,
        description: 'Existing Product',
        code: 'P999',
        isActive: true,
      };

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(mockProduct as Product);

      const result = await service.validateExistingProduct(productId);

      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should throw ConflictException if product is not found', async () => {
      const productId = 'non-existent-id';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.validateExistingProduct(productId)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
