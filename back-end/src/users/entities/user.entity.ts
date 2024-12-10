import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientRole } from "../enums/role.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: false })
    role: ClientRole

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
