import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "refreshTokens" })
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    token!: string;

    @Column({ nullable: true })
    userAgent!: string;
    
    @Column({ nullable: true })
    ip!: string;

    @Column()
    userId!: string;

    @ManyToOne(() => User, user => user.posts)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date;
}