import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from '../../line/entities/line.entity';
import { Product } from '../../products/entities/product.entity';
import { Production } from './production.entity';

@Entity()
export class ProductionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.productionPlans, {
    nullable: false,
  })
  product: Product;

  @Column({ type: 'date', nullable: false })
  datePrev: Date;

  @Column({ type: 'int', nullable: false })
  qtd: number;

  @ManyToOne(() => Line, (line) => line.productionPlans, { nullable: true })
  line: Line | null;

  @OneToMany(() => Production, (production) => production.productionPlan)
  productions: Production[];
}
