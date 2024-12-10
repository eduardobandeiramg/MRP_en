import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ResetToken {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    token: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({nullable: false})
    expiryDate: Date;

    constructor(resetToken: Partial<ResetToken>) {
        Object.assign(this, resetToken);
    }
}
