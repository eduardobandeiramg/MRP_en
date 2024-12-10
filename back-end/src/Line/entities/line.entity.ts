import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionPlan } from '../../production_plans/entities/production_plan.entity';

@Entity()
export class Line {
  @PrimaryGeneratedColumn('uuid')
  lineId: string;

  @Column()
  name: string;

  @OneToMany(() => ProductionPlan, (productionPlan) => productionPlan.line)
  productionPlans: ProductionPlan[];
}
