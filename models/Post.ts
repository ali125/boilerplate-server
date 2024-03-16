import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, DeleteDateColumn } from "typeorm"

@Entity({ name: "posts" })
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        length: 100,
    })
    title!: string

    @Column("text")
    description!: string

    @Column()
    isPublished!: boolean

    @Column({
        type: "timestamp",
        nullable: true
    })
    publishedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date;

    @BeforeInsert()
    updatePublishedDate() {
        if (this.isPublished) {
            this.publishedAt = new Date();
        }
    }
}
