import { Material } from "src/materials/entities/material.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BuildOfMaterial {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    lvl: number;

    @Column()
    qtd: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Material)
    material: Material;

    @ManyToOne(() => BuildOfMaterial, (buildOfMaterial) => buildOfMaterial.childMaterials, { nullable: true })
    parentBuildOfMaterial: BuildOfMaterial;

    @OneToMany(() => BuildOfMaterial, (buildOfMaterial) => buildOfMaterial.parentBuildOfMaterial, { cascade: ['remove'] })
    childMaterials: BuildOfMaterial[];

    constructor(buildOfMaterial: Partial<BuildOfMaterial>){
        Object.assign(this, buildOfMaterial);
    }
}
