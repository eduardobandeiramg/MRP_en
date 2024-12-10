import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuildOfMaterialsService } from './build_of_materials.service';
import { CreateBuildOfMaterialDto } from './dto/create-build_of_material.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('build-of-materials')
@ApiBearerAuth()
@Controller('build-of-materials')
export class BuildOfMaterialsController {
	constructor(private readonly buildOfMaterialsService: BuildOfMaterialsService) {}

	@Post()
	create(@Body() createBuildOfMaterialDto: CreateBuildOfMaterialDto) {
		return this.buildOfMaterialsService.create(createBuildOfMaterialDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.buildOfMaterialsService.remove(id);
	}

	@Get('product/:id')
    getBuildOfMaterialsByProduct(@Param('id') productId: string) {
        return this.buildOfMaterialsService.getByProductAndLvl(productId, 1);
    }

	@Get('children/:id')
    getDirectChildren(@Param('id') buildOfMaterialId: string) {
        return this.buildOfMaterialsService.getDirectChildren(buildOfMaterialId);
    }
}
