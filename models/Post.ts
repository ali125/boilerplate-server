import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate, DeleteDateColumn, BeforeInsert } from "typeorm"
import slugify from 'slugify'; 
import { AppDataSource } from "../config/db";

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

    @Column({
        default: false
    })
    isPublished!: boolean

    @Column({
        type: "timestamp",
        nullable: true
    })
    publishedAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date;

    @BeforeUpdate()
    updatePublishedDate() {
        if (this.isPublished) {
            this.publishedAt = new Date();
        } else {
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
