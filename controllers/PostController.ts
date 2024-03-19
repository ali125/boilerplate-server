import { Response, Request } from "express";
import { Post } from "../models/Post";
import { AppDataSource } from "../config/db";

const postRepository = AppDataSource.getRepository(Post);

class PostController {
    getAll = async (req: Request, res: Response) => {
        try {
            const posts = await postRepository.find();
            res.status(200).json({ posts });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() })
        }
    }
    
    add = async (req: Request, res: Response) => {
        try {
            const { title, description } = req.body;
    
            const post = new Post();
            post.title = title
            post.description = description
    
            const result = await AppDataSource.manager.save(post)
    
            res.status(201).json({ result });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() })
        }
    }
    
    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const post = await postRepository.findOneBy({ id });
            if (!post) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            res.status(200).json({ post });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };
    
    getBySlug = async (req: Request, res: Response) => {
        try {
            const slug = req.params.slug;
            const post = await postRepository.findOneBy({ slug });
            if (!post) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            res.status(200).json({ post });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };

    updateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
    
            const post = await postRepository.findOneBy({ id });
            if (!post) {
                return res.status(404).json({ error: 'Not Found', message: 'Post not found' });
            }
    
            if (title) post.title = title;
            if (description) post.description = description;
    
            await postRepository.save(post);
            res.status(200).json({ post });
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };

    deleteById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const post = await postRepository.findOneBy({ id });
            if (!post) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            await postRepository.softRemove(post);
            res.sendStatus(204);
        } catch (e: any) {
            res.status(500).json({ error: e.toString() });
        }
    };
}

const postController = new PostController();

export default postController;
