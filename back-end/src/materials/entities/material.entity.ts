import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Material {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 8, nullable: false, unique: true })
    code: string;

    @Column({ nullable: false })
    description: string;

    @Column({ default: 0 })
    qtd: number;

    constructor(material: Partial<Material>) {
        Object.assign(this, material);
    }
}
