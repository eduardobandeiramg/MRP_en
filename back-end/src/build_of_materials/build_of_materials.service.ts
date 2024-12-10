import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from 'src/materials/entities/material.entity';
import { MaterialsService } from 'src/materials/materials.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateBuildOfMaterialDto } from './dto/create-build_of_material.dto';
import { BuildOfMaterial } from './entities/build_of_material.entity';

@Injectable()
export class BuildOfMaterialsService {
  constructor(
    @InjectRepository(BuildOfMaterial)
    private buildOfMaterialsRepository: Repository<BuildOfMaterial>,
    private materialsService: MaterialsService,
    private productsService: ProductsService,
  ) {}

  async create(
    createBuildOfMaterialDto: CreateBuildOfMaterialDto,
  ): Promise<void> {
    const { product, material, parentBuildOfMaterial } =
      await this.validateCreate(createBuildOfMaterialDto);

    const lvl = await this.calculateLevel(parentBuildOfMaterial);

    const buildOfMaterial = this.buildOfMaterialsRepository.create({
      product,
      material,
      parentBuildOfMaterial,
      lvl,
      qtd: createBuildOfMaterialDto.qtd,
    });

    try {
      await this.buildOfMaterialsRepository.save(buildOfMaterial);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating Build Of Material',
      );
    }
  }

  async remove(id: string): Promise<void> {
    const buildOfMaterial = await this.buildOfMaterialsRepository.findOne({
      where: { id },
      relations: ['childMaterials'],
    });

    if (!buildOfMaterial) {
      throw new NotFoundException(`BuildOfMaterial with ID ${id} not found`);
    }

    for (const child of buildOfMaterial.childMaterials) {
      await this.remove(child.id);
    }

    try {
      await this.buildOfMaterialsRepository.remove(buildOfMaterial);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while deleting Build Of Material',
      );
    }
  }

  async getByProductAndLvl(
    productId: string,
    lvl: number,
  ): Promise<BuildOfMaterial[]> {
    const product =
      await this.productsService.validateExistingProduct(productId);

    try {
      const buildOfMaterials = await this.buildOfMaterialsRepository.find({
        where: { product, lvl },
        relations: ['material'],
      });

      return buildOfMaterials;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while retrieving Build of Materials',
      );
    }
  }

  async getDirectChildren(id: string): Promise<BuildOfMaterial[]> {
    const parentBuildOfMaterial = await this.buildOfMaterialsRepository.findOne(
      { where: { id } },
    );

    if (!parentBuildOfMaterial) {
      throw new NotFoundException(`BuildOfMaterial with ID ${id} not found`);
    }

    const children = await this.buildOfMaterialsRepository.find({
      where: { parentBuildOfMaterial: { id } },
      relations: ['material'],
    });

    return children;
  }

  async validateCreate(
    createBuildOfMaterialDto: CreateBuildOfMaterialDto,
  ): Promise<{
    product: Product;
    material: Material;
    parentBuildOfMaterial?: BuildOfMaterial;
  }> {
    const { productId, materialId, parentBuildOfMaterialId } =
      createBuildOfMaterialDto;

    const product =
      await this.productsService.validateExistingProduct(productId);
    const material =
      await this.materialsService.validateExistingMaterial(materialId);

    let parentBuildOfMaterial: BuildOfMaterial = null;
    if (parentBuildOfMaterialId) {
      parentBuildOfMaterial = await this.buildOfMaterialsRepository.findOne({
        where: { id: parentBuildOfMaterialId },
      });
      if (!parentBuildOfMaterial) {
        throw new NotFoundException(
          `Parent BuildOfMaterial with ID ${parentBuildOfMaterialId} not found`,
        );
      }
    }

    return { product, material, parentBuildOfMaterial };
  }

  async calculateLevel(
    parentBuildOfMaterial?: BuildOfMaterial,
  ): Promise<number> {
    if (parentBuildOfMaterial) {
      return parentBuildOfMaterial.lvl + 1;
    }
    return 1;
  }
}
