import { Production } from 'src/production_plans/entities/production.entity';
import { ProductionPlan } from 'src/production_plans/entities/production_plan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProductionPlan, (productionPlan) => productionPlan.product)
  productionPlans: ProductionPlan[];

  @OneToMany(() => Production, (production) => production.product)
  productions: Production[];
}
