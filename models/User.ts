import { BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcrypt";

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
    async updatePassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}
