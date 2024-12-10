import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<void> {
    const { description, code } = createProductDto;

    await this.validateProduct(description);

    const product = this.productsRepository.create({
      description,
      code,
    });

    try {
      await this.productsRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar produto.');
    }
  }

  async validateProduct(description: string): Promise<void> {
    const existingProduct = await this.findOneProduct(description);
    if (existingProduct) {
      throw new ConflictException('Descrição já está em uso.');
    }
  }

  async findOneProduct(description: string): Promise<Product | null> {
    return await this.productsRepository.findOne({
      where: { description, isActive: true },
    });
  }

  async findOneByID(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async findAll(): Promise<Product[]> {
    try {
      return await this.productsRepository.find({ where: { isActive: true } });
    } catch (error) {
      throw new Error('Erro ao buscar linhas de produção: ' + error.message);
    }
  }

  async deactivateProduct(id: string): Promise<void> {
    const product = await this.findOneByID(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isActive = false;
    await this.productsRepository.save(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    const product = await this.findOneByID(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { description, code } = updateProductDto;

    if (description !== undefined) {
      product.description = description;
    }

    if (code !== undefined) {
      product.code = code;
    }

    await this.productsRepository.save(product);
    return product;
  }

  async validateExistingProduct(id: string): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new ConflictException('Product not found.');
    }
    return existingProduct;
  }
}
