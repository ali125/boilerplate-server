import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, DeleteDateColumn, BeforeInsert, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import slugify from 'slugify'; 
import { AppDataSource } from "../config/db";
import { User } from "./User";

// Define enum for status options
export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    BLOCKED = 'blocked',
}

@Entity({ name: "posts" })
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        length: 100,
    })
    title!: string

    @Column({
        length: 100,
    })
    slug!: string

    @Column("text")
    description!: string

    @Column()
    userId!: string;

    @ManyToOne(() => User, user => user.posts)
    user!: User;

    @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT }) // default value is Draft
    status!: PostStatus;

    @Column({
        type: "timestamp",
        nullable: true
    })
    publishedAt!: Date | null;

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

    @BeforeUpdate()
    updateStatusDate() {
        if (this.status === PostStatus.PUBLISHED) {
            this.publishedAt = new Date();
        } else if (this.status === PostStatus.BLOCKED) {
            this.blockedAt = new Date();
        } else {
            this.blockedAt = null;
            this.publishedAt = null;
        }
    }

    @BeforeInsert()
    async generateSlug() {
        // Generate slug based on title
        let baseSlug = slugify(this.title, { lower: true });

        // Check if slug already exists
        let slugExists = true;
        let counter = 1;
        let newSlug = baseSlug;
        while (slugExists) {
            const postRepository = AppDataSource.getRepository(Post);
            // Check if slug already exists in the database
            // (You need to implement a function to check if a slug exists in your repository)
            const existingPost = await postRepository.findOneBy({ slug: newSlug });
            if (!existingPost) {
                // If the slug does not exist, set it to the newSlug
                this.slug = newSlug;
                slugExists = false;
            } else {
                // If the slug exists, generate a new slug by appending a counter
                newSlug = `${baseSlug}-${counter}`;
                counter++;
            }
        }
    }
}
