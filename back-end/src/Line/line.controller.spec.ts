import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Line } from './entities/line.entity';
import { LineController } from './line.controller';
import { LineService } from './line.service';

describe('LineController', () => {
  let controller: LineController;
  let service: LineService;

  const mockLineService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneByID: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineController],
      providers: [
        {
          provide: LineService,
          useValue: mockLineService,
        },
      ],
    }).compile();

    controller = module.get<LineController>(LineController);
    service = module.get<LineService>(LineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters and return the result', async () => {
      const createLineDto: CreateLineDto = { name: 'Line A' };
      const createdLine: Line = {
        lineId: '123',
        name: 'Line A',
        productionPlans: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdLine);

      const result = await controller.create(createLineDto);

      expect(service.create).toHaveBeenCalledWith(createLineDto);
      expect(result).toEqual(createdLine);
    });
  });

  describe('getAll', () => {
    it('should call service.findAll and return the result', async () => {
      const mockLines: Line[] = [
        { lineId: '1', name: 'Line A', productionPlans: [] },
        { lineId: '2', name: 'Line B', productionPlans: [] },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockLines);

      const result = await controller.getAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockLines);
    });
  });

  describe('getById', () => {
    it('should return a line by ID', async () => {
      const mockLine: Line = {
        lineId: '1',
        name: 'Line A',
        productionPlans: [],
      };

      jest.spyOn(service, 'findOneByID').mockResolvedValue(mockLine);

      const result = await controller.getById('1');

      expect(service.findOneByID).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockLine);
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(service, 'findOneByID').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.getById('2')).rejects.toThrow(NotFoundException);
      expect(service.findOneByID).toHaveBeenCalledWith('2');
    });
  });

  describe('update', () => {
    it('should update a line and return the updated line', async () => {
      const updateLineDto: UpdateLineDto = { name: 'Updated Line' };
      const updatedLine: Line = {
        lineId: '1',
        name: 'Updated Line',
        productionPlans: [],
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedLine);

      const result = await controller.update('1', updateLineDto);

      expect(service.update).toHaveBeenCalledWith('1', updateLineDto);
      expect(result).toEqual(updatedLine);
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(
        controller.update('2', { name: 'Updated Line' }),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith('2', {
        name: 'Updated Line',
      });
    });
  });
  describe('delete', () => {
    it('should delete a line by ID and return void', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.delete('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the line does not exist', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.delete('2')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith('2');
    });
  });
});
