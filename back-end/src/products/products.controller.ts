import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('by-description')
    async getProductByDescription(@Query('description') description: string): Promise<Product | null> {
        return this.productsService.findOneProduct(description);
    }

  @Get('by-uid/:id')
  @ApiParam({ name: 'id', type: String, required: true })
  async getProductByUID(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOneByID(id);
  }

  @Get('all')
  async getAllProducts(): Promise<Product[]>{
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() createPrdDTO: CreateProductDTO): Promise<void> {
    return this.productsService.create(createPrdDTO);
  }

  @Delete(':id')
  async deactivateProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.deactivateProduct(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDTO): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }
}