import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMaterialStockDto } from './dto/update-material-stock.dto';

describe('MaterialsController', () => {
	let controller: MaterialsController;
	let service: MaterialsService;

	const mockMaterialsService = {
		create: jest.fn(),
		update: jest.fn(),
		findAll: jest.fn(),
		findById: jest.fn(),
		delete: jest.fn(),
		updateStock: jest.fn(),
		addStock: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MaterialsController],
			providers: [
				{
					provide: MaterialsService,
					useValue: mockMaterialsService,
				},
			],
		}).compile();

		controller = module.get<MaterialsController>(MaterialsController);
		service = module.get<MaterialsService>(MaterialsService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

  	describe('create', () => {
		it('should call the create method of the service with the correct DTO', async () => {
			const createMaterialDto: CreateMaterialDto = {
				code: 'MAT001',
				description: 'Material 1',
			};

			await controller.create(createMaterialDto);
			expect(service.create).toHaveBeenCalledWith(createMaterialDto);
		});
  	});

  	describe('update', () => {
		it('should call the update method of the service with the correct id and DTO', async () => {
			const id = uuidv4();;
			const updateMaterialDto: UpdateMaterialDto = {
				code: 'MAT002',
				description: 'Updated Material',
			};

			await controller.update(id, updateMaterialDto);
			expect(service.update).toHaveBeenCalledWith(id, updateMaterialDto);
		});
  	});

	describe('findAll', () => {
		it('should call the findAll method of the service', async () => {
			await controller.findAll();
			expect(service.findAll).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		it('should call the findById method of the service with the correct id', async () => {
			const id = uuidv4();;
			await controller.findById(id);
			expect(service.findById).toHaveBeenCalledWith(id);
		});
	});

	describe('delete', () => {
		it('should call the delete method of the service with the correct id', async () => {
			const id = uuidv4();;
			await controller.delete(id);
			expect(service.delete).toHaveBeenCalledWith(id);
		});
	});

	describe('update stock', () => {
		it('should call the updateStock method of the service with the correct DTO', async () => {
			const updateMaterialStockDto: UpdateMaterialStockDto = {
				id: uuidv4(),
				qtd: 5,
			};

			await controller.updateStock(updateMaterialStockDto);
			expect(service.updateStock).toHaveBeenCalledWith(updateMaterialStockDto);
		});
	});

	describe('add stock', () => {
		it('should call the addStock method of the service with the correct DTO', async () => {
			const updateMaterialStockDto: UpdateMaterialStockDto = {
				id: uuidv4(),
				qtd: 5,
			};

			await controller.addStock(updateMaterialStockDto);
			expect(service.addStock).toHaveBeenCalledWith(updateMaterialStockDto);
		});
	});
});
