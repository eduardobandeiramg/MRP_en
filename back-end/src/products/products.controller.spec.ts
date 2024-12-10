import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockService = {
    create: jest.fn(),
    updateProduct: jest.fn(),
    findOneByID: jest.fn(),
    findAll: jest.fn(),
    deactivateProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('createProduct', () => {
    it('deve chamar o service.create com o DTO correto', async () => {
      const createDto: CreateProductDTO = {
        code: 'Product B',
        description: 'Description of Product B',
      };

      await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateProduct', () => {
    it('deve chamar o service.updateProduct com o ID e DTO corretos', async () => {
      const productId = '12345';
      const updateDto: UpdateProductDTO = {
        code: 'Updated Product B',
        description: 'Updated Description',
      };

      const mockUpdatedProduct = {
        id: productId,
        code: 'Updated Product B',
        description: 'Updated Description',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      jest
        .spyOn(service, 'updateProduct')
        .mockResolvedValue(mockUpdatedProduct);

      const result = await controller.updateProduct(productId, updateDto);
      expect(result).toEqual(mockUpdatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(productId, updateDto);
    });
  });

  describe('findOneByID', () => {
    it('deve chamar o service.findOneByID com o ID correto', async () => {
      const productId = '12345';
      const mockProduct = {
        id: productId,
        code: 'Updated Product B',
        description: 'Updated Description',
        isActive: true,
        productionPlans: [],
        productions: [],
      };
      jest.spyOn(service, 'findOneByID').mockResolvedValue(mockProduct);

      const result = await controller.getProductByUID(productId);
      expect(result).toEqual(mockProduct);
      expect(service.findOneByID).toHaveBeenCalledWith(productId);
    });
  });

  describe('findAll', () => {
    it('deve chamar o service.findAll para buscar todos os produtos', async () => {
      const productId = '12345';
      const productId2 = '1235';

      const mockProducts = [
        {
          id: productId,
          code: 'Updated Product B',
          description: 'Updated Description',
          isActive: true,
          productionPlans: [],
          productions: [],
        },
        {
          id: productId2,
          code: 'Updated Product B',
          description: 'Updated Description',
          isActive: true,
          productionPlans: [],
          productions: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockProducts);

      const result = await controller.getAllProducts();
      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('deactivateProduct', () => {
    it('deve chamar o service.deactivateProduct com o ID correto', async () => {
      const productId = '12345';
      jest.spyOn(service, 'deactivateProduct').mockResolvedValue();

      await controller.deactivateProduct(productId);
      expect(service.deactivateProduct).toHaveBeenCalledWith(productId);
    });
  });
});
