import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { v4 as uuidv4 } from 'uuid';

describe('MaterialsService', () => {
	let service: MaterialsService;
	let materialsRepository: Repository<Material>;

	const mockMaterialRepository = {
		findOne: jest.fn(),
		find: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		updateStock: jest.fn(),
		addStock: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaterialsService,
				{
					provide: getRepositoryToken(Material),
					useValue: mockMaterialRepository,
				},
			],
		}).compile();

		service = module.get<MaterialsService>(MaterialsService);
		materialsRepository = module.get<Repository<Material>>(getRepositoryToken(Material));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

  	describe('create', () => {
		it('should create a new material', async () => {
			const createMaterialDto: CreateMaterialDto = {
				code: 'MAT001',
				description: 'Material 1',
			};

			mockMaterialRepository.findOne.mockResolvedValue(null);
			mockMaterialRepository.create.mockReturnValue(createMaterialDto);
			mockMaterialRepository.save.mockResolvedValue(undefined);

			await service.create(createMaterialDto);

			expect(mockMaterialRepository.create).toHaveBeenCalledWith({
				code: 'MAT001'.toUpperCase(),
				description: 'Material 1',
			});
			expect(mockMaterialRepository.save).toHaveBeenCalled();
		});

		it('should throw a ConflictException if the code already exists', async () => {
			const createMaterialDto: CreateMaterialDto = {
				code: 'MAT001',
				description: 'Material 1',
			};

			mockMaterialRepository.findOne.mockResolvedValue(createMaterialDto);

			await expect(service.create(createMaterialDto)).rejects.toThrow(ConflictException);
		});

		it('should throw InternalServerErrorException if save fails', async () => {
			const createMaterialDto: CreateMaterialDto = {
				code: 'MAT001',
				description: 'Material 1',
			};

			mockMaterialRepository.findOne.mockResolvedValue(null);
			mockMaterialRepository.create.mockReturnValue(createMaterialDto);
			mockMaterialRepository.save.mockRejectedValue(new Error('Save failed'));

			await expect(service.create(createMaterialDto)).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('update', () => {
		it('should update the material', async () => {
			const id = uuidv4();
			const updateMaterialDto: UpdateMaterialDto = {
				code: 'MAT002',
				description: 'Updated Material',
			};

			mockMaterialRepository.findOne.mockResolvedValueOnce({ id, ...updateMaterialDto });
			mockMaterialRepository.findOne.mockResolvedValueOnce(null);
			mockMaterialRepository.update.mockResolvedValue(undefined);

			await service.update(id, updateMaterialDto);

			expect(mockMaterialRepository.update).toHaveBeenCalledWith(id, {
				code: 'MAT002'.toUpperCase(),
				description: 'Updated Material',
			});
		});

		it('should throw a ConflictException if the code already exists for another material', async () => {
			const id = uuidv4();
			const updateMaterialDto: UpdateMaterialDto = {
				code: 'MAT002',
				description: 'Updated Material',
			};

			mockMaterialRepository.findOne.mockResolvedValueOnce({ id, ...updateMaterialDto }); // material com id
			mockMaterialRepository.findOne.mockResolvedValueOnce({ id: uuidv4(), code: 'MAT002' }); // material com mesmo código mas id diferente

			await expect(service.update(id, updateMaterialDto)).rejects.toThrow(ConflictException);
		});

		it('should throw InternalServerErrorException if update fails', async () => {
			const id = uuidv4();
			const updateMaterialDto: UpdateMaterialDto = {
			  code: 'MAT002',
			  description: 'Updated Material',
			};
		  
			mockMaterialRepository.findOne.mockResolvedValueOnce({ id, ...updateMaterialDto });
			mockMaterialRepository.findOne.mockResolvedValueOnce(null);
			
			mockMaterialRepository.update.mockRejectedValue(new Error('Update failed'));
		  
			await expect(service.update(id, updateMaterialDto)).rejects.toThrow(InternalServerErrorException);
		});
		  
	});

	describe('findAll', () => {
		it('should return an array of materials', async () => {
			const materials = [
				{ id: uuidv4(), code: 'MAT001', description: 'Material 1' },
				{ id: uuidv4(), code: 'MAT002', description: 'Material 2' },
			];

			mockMaterialRepository.find.mockResolvedValue(materials);

			const result = await service.findAll();
			expect(result).toEqual(materials);
			expect(mockMaterialRepository.find).toHaveBeenCalled();
		});

		it('should throw InternalServerErrorException if findAll fails', async () => {
			mockMaterialRepository.find.mockRejectedValue(new Error('Find failed'));
			await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('findById', () => {
		it('should return a material by ID', async () => {
			const id = uuidv4();
			const material = { id, code: 'MAT001', description: 'Material 1' };

			mockMaterialRepository.findOne.mockResolvedValue(material);

			const result = await service.findById(id);
			expect(result).toEqual(material);
			expect(mockMaterialRepository.findOne).toHaveBeenCalledWith({ where: { id } });
		});

		it('should throw a ConflictException if the material is not found', async () => {
			const id = uuidv4();
			mockMaterialRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(id)).rejects.toThrow(ConflictException);
		});
	});

	describe('delete', () => {
		it('should delete a material', async () => {
			const id = uuidv4();
			const material = { id, code: 'MAT001', description: 'Material 1' };

			mockMaterialRepository.findOne.mockResolvedValue(material);
			mockMaterialRepository.delete.mockResolvedValue(undefined);

			await service.delete(id);
			expect(mockMaterialRepository.delete).toHaveBeenCalledWith(material);
		});

		it('should throw a ConflictException if the material is not found before deleting', async () => {
			const id = uuidv4();
			mockMaterialRepository.findOne.mockResolvedValue(null);

			await expect(service.delete(id)).rejects.toThrow(ConflictException);
		});

		it('should throw InternalServerErrorException if delete fails', async () => {
			const id = uuidv4();
			const material = { id, code: 'MAT001', description: 'Material 1' };

			mockMaterialRepository.findOne.mockResolvedValue(material);
			mockMaterialRepository.delete.mockRejectedValue(new Error('Delete failed'));

			await expect(service.delete(id)).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('updateStock', () => {
		it('should update the material stock successfully', async () => {
			const id = uuidv4();
			const updateMaterialStockDto = { id, qtd: 20 };
			const mockMaterial = {
				id,
				code: 'MAT001',
				description: 'Material description',
				qtd: 10
			};

			jest.spyOn(service, 'validateExistingMaterial').mockResolvedValue(mockMaterial);
			mockMaterialRepository.save.mockResolvedValue(mockMaterial);

			await service.updateStock(updateMaterialStockDto);

			expect(service.validateExistingMaterial).toHaveBeenCalledWith(id);
			expect(mockMaterialRepository.save).toHaveBeenCalledWith({ ...mockMaterial, qtd: 20 });
		});

		it('should throw an InternalServerErrorException when save fails', async () => {
			const id = uuidv4();
			const updateMaterialStockDto = { id, qtd: 20 };
			const mockMaterial = {
				id,
				code: 'MAT001',
				description: 'Material description',
				qtd: 10
			};

			jest.spyOn(service, 'validateExistingMaterial').mockResolvedValue(mockMaterial);

			mockMaterialRepository.save.mockRejectedValueOnce(new Error());
			await expect(service.updateStock(updateMaterialStockDto)).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('addStock', () => {
		it('should add stock to the material successfully', async () => {
			const id = uuidv4();
			const updateMaterialStockDto = { id, qtd: 5 };
			const mockMaterial = {
				id,
				code: 'MAT001',
				description: 'Material description',
				qtd: 10
			};

			jest.spyOn(service, 'validateExistingMaterial').mockResolvedValue({ ...mockMaterial });
			mockMaterialRepository.save.mockResolvedValue({ ...mockMaterial, qtd: 15 });

			await service.addStock(updateMaterialStockDto);

			expect(service.validateExistingMaterial).toHaveBeenCalledWith(id);
			expect(mockMaterialRepository.save).toHaveBeenCalledWith({ ...mockMaterial, qtd: mockMaterial.qtd + updateMaterialStockDto.qtd });
		});

		it('should throw an InternalServerErrorException when save fails during addStock', async () => {
			const id = uuidv4();
			const updateMaterialStockDto = { id, qtd: 5 };
			const mockMaterial = {
				id,
				code: 'MAT001',
				description: 'Material description',
				qtd: 10
			};

			jest.spyOn(service, 'validateExistingMaterial').mockResolvedValue(mockMaterial);

			mockMaterialRepository.save.mockRejectedValueOnce(new Error());
			await expect(service.addStock(updateMaterialStockDto)).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('validateExistingMaterial', () => {
		it('should return the existing material', async () => {
			const id = uuidv4();
			const material = { id, code: 'MAT001', description: 'Material 1' };

			mockMaterialRepository.findOne.mockResolvedValue(material);

			const result = await service.validateExistingMaterial(id);
			expect(result).toEqual(material);
			expect(mockMaterialRepository.findOne).toHaveBeenCalledWith({ where: { id } });
		});

		it('should throw a ConflictException if the material is not found', async () => {
			const id = uuidv4();
			mockMaterialRepository.findOne.mockResolvedValue(null);

			await expect(service.validateExistingMaterial(id)).rejects.toThrow(ConflictException);
		});
	});
});
