import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { BuildOfMaterialsModule } from './build_of_materials/build_of_materials.module';
import { DatabaseModule } from './database/database.module';
import { LineModule } from './line/line.module';
import { MaterialsModule } from './materials/materials.module';
import { ProductionModule } from './production_plans/production/production.module';
import { ProductionPlansModule } from './production_plans/production_plans/production_plans.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    LineModule,
    AuthModule,
    MaterialsModule,
    BuildOfMaterialsModule,
    ProductionPlansModule,
    ProductionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
