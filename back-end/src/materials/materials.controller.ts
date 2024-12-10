import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialStockDto } from './dto/update-material-stock.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialsService } from './materials.service';

@ApiTags('materials')
@ApiBearerAuth()
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.materialsService.findById(id);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.materialsService.delete(id);
  }

  @HttpCode(204)
  @Patch('/stock/update')
  updateStock(@Body() updateMaterialStockDto: UpdateMaterialStockDto) {
    return this.materialsService.updateStock(updateMaterialStockDto);
  }

  @HttpCode(204)
  @Patch('/stock/add')
  addStock(@Body() updateMaterialStockDto: UpdateMaterialStockDto) {
    return this.materialsService.addStock(updateMaterialStockDto);
  }
}
