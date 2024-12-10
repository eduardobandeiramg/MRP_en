import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductionStatus } from '../enums/status.enum';
import { ProductionPlan } from './production_plan.entity';

@Entity()
export class Production {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.productions, {
    nullable: true,
  })
  product?: Product;

  @ManyToOne(
    () => ProductionPlan,
    (productionPlan) => productionPlan.productions,
    { nullable: true },
  )
  productionPlan?: ProductionPlan;

  @Column({ type: 'date', nullable: true })
  dateInit?: Date;

  @Column({ type: 'date', nullable: true })
  dateEnd?: Date;

  @Column({
    type: 'enum',
    enum: ProductionStatus,
    default: ProductionStatus.A_PRODUZIR,
  })
  status: ProductionStatus;
}
