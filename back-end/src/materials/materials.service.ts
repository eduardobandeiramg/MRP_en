import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialStockDto } from './dto/update-material-stock.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<void> {
    await this.validateCreate(createMaterialDto);
    const { description, code } = createMaterialDto;
    const material = this.materialsRepository.create({
      code: code.toUpperCase(),
      description,
    });
    try {
      await this.materialsRepository.save(material);
    } catch (error) {
      throw new InternalServerErrorException('Error creating material.');
    }
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<void> {
    await this.validateUpdate(id, updateMaterialDto);
    const { description, code } = updateMaterialDto;
    try {
      await this.materialsRepository.update(id, {
        code: code.toUpperCase(),
        description,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating material.');
    }
  }

  async findAll(): Promise<Array<Material>> {
    try {
      const materials = await this.materialsRepository.find();
      return materials;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving materials.');
    }
  }

  async findById(id: string): Promise<Material> {
    const material = await this.validateExistingMaterial(id);
    return material;
  }

  async delete(id: string): Promise<void> {
    const material = await this.validateExistingMaterial(id);
    try {
      await this.materialsRepository.remove(material);
    } catch (error) {
      console.error('Error details:', error);
      throw new InternalServerErrorException('Error deleting material.');
    }
  }

  async updateStock(
    updateMaterialStockDto: UpdateMaterialStockDto,
  ): Promise<void> {
    const { id, qtd } = updateMaterialStockDto;
    const material = await this.validateExistingMaterial(id);
    try {
      material.qtd = qtd;
      await this.materialsRepository.save(material);
    } catch (error) {
      throw new InternalServerErrorException('Error updating material.');
    }
  }

  async addStock(
    updateMaterialStockDto: UpdateMaterialStockDto,
  ): Promise<void> {
    const { id, qtd } = updateMaterialStockDto;
    const material = await this.validateExistingMaterial(id);
    try {
      material.qtd += qtd;
      await this.materialsRepository.save(material);
    } catch (error) {
      throw new InternalServerErrorException('Error updating material.');
    }
  }

  async validateCreate(createMaterialDto: CreateMaterialDto): Promise<void> {
    const { code } = createMaterialDto;
    const existingMaterial = await this.materialsRepository.findOne({
      where: { code: code.toUpperCase() },
    });
    if (existingMaterial) {
      throw new ConflictException('Material with this code already exists.');
    }
  }

  async validateUpdate(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const { code } = updateMaterialDto;
    const existingMaterial = await this.validateExistingMaterial(id);

    const existingMaterialCode = await this.materialsRepository.findOne({
      where: { id: Not(id), code: code.toUpperCase() },
    });

    if (existingMaterialCode) {
      throw new ConflictException('Material with this code already exists.');
    }

    return existingMaterial;
  }

  async validateExistingMaterial(id: string): Promise<Material> {
    const existingMaterial = await this.materialsRepository.findOne({
      where: { id },
    });
    if (!existingMaterial) {
      throw new ConflictException('Material not found.');
    }
    return existingMaterial;
  }
}
