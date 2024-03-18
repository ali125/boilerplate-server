import { BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcrypt";
import { Post } from "./Post";

// Define enum for status options
export enum UserStatus {
    ACTIVE = 'active',
    BLOCKED = 'blocked',
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        length: 100
    })
    firstName!: string;

    @Column({
        length: 100
    })
    lastName!: string;

    @Column({
        length: 100,
        unique: true
    })
    email!: string;

    @Column({
        length: 100,
        unique: true,
        nullable: true
    })
    mobile!: string;

    @Column({
        length: 100,
        select: false
    })
    password!: string;

    @Column({
        length: 100,
        nullable: true
    })
    resetToken!: string;

    @OneToMany(() => Post, post => post.user)
    posts!: Post[];

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }) // default value is Draft
    status!: UserStatus;

    @Column({
        type: "timestamp",
        nullable: true
    })
    blockedAt!: Date | null;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date;

    // Define a getter method for the virtual column
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @BeforeUpdate()
    updateStatusDate() {
        if (this.status === UserStatus.BLOCKED) {
            this.blockedAt = new Date();
        } else {
            this.blockedAt = null;
        }
    }

    @BeforeUpdate()
    async updatePassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
