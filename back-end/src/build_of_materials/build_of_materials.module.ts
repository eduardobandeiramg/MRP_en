import { Module } from '@nestjs/common';
import { BuildOfMaterialsService } from './build_of_materials.service';
import { BuildOfMaterialsController } from './build_of_materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildOfMaterial } from './entities/build_of_material.entity';
import { ProductsModule } from 'src/products/products.module';
import { MaterialsModule } from 'src/materials/materials.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([BuildOfMaterial]),
		MaterialsModule,
		ProductsModule
	],
	controllers: [BuildOfMaterialsController],
	providers: [BuildOfMaterialsService],
	exports: [BuildOfMaterialsService]
})
export class BuildOfMaterialsModule {}
