import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Line } from './entities/line.entity';
import { LineService } from './line.service';

describe('LineService', () => {
  let service: LineService;
  let repository: Repository<Line>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineService,
        {
          provide: getRepositoryToken(Line),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LineService>(LineService);
    repository = module.get<Repository<Line>>(getRepositoryToken(Line));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new line', async () => {
      const createLineDto: CreateLineDto = { name: 'Line A' };
      const newLine: Line = {
        lineId: '123',
        name: 'Line A',
        productionPlans: [],
      };

      jest.spyOn(repository, 'create').mockReturnValue(newLine);
      jest.spyOn(repository, 'save').mockResolvedValue(newLine);

      const result = await service.create(createLineDto);

      expect(repository.create).toHaveBeenCalledWith({ name: 'Line A' });
      expect(repository.save).toHaveBeenCalledWith(newLine);
      expect(result).toEqual(newLine);
    });
  });

  describe('findAll', () => {
    it('should retrieve all lines from the database', async () => {
      const mockLines: Line[] = [
        { lineId: '1', name: 'Line A', productionPlans: [] },
        { lineId: '2', name: 'Line B', productionPlans: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockLines);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockLines);
    });
  });

  describe('findOne', () => {
    it('should return a line by ID', async () => {
      const mockLine: Line = {
        lineId: '1',
        name: 'Line A',
        productionPlans: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLine);

      const result = await service.findOneByID('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '1' },
      });
      expect(result).toEqual(mockLine);
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneByID('2');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Line not found');
      }

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '2' },
      });
    });
  });

  describe('update', () => {
    it('should update a line and return the updated line', async () => {
      const updateLineDto: UpdateLineDto = { name: 'Updated Line' };
      const existingLine: Line = {
        lineId: '1',
        name: 'Line A',
        productionPlans: [],
      };
      const updatedLine: Line = { ...existingLine, ...updateLineDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingLine);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedLine);

      const result = await service.update('1', updateLineDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '1' },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedLine);
      expect(result).toEqual(updatedLine);
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('2', { name: 'Updated Line' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '2' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a line by ID and return void', async () => {
      const mockLine: Line = {
        lineId: '1',
        name: 'Line A',
        productionPlans: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLine);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any); // Simula sucesso na exclusão

      await service.remove('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '1' },
      });
      expect(repository.delete).toHaveBeenCalledWith(mockLine.lineId);
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('2')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { lineId: '2' },
      });
    });
  });
});
