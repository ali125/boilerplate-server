import { Response, Request } from "express";
import { Post } from "../models/Post";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

class PostController {
    getAll = async (req: Request, res: Response) => {
        try {
            const data = await postRepository.find();
            res.status(200).json({ data });
        } catch (e: any) {
            res.status(500).json({ error: e.message })
        }
    }
    
    add = async (req: Request, res: Response) => {
        try {
            const { title, description } = req.body;

            const user = await userRepository.findOne({ where: { email: req.email }, select: ['id']});

            if (!user) {
                return res.sendStatus(401); // Unauthorized
            }
    
            const post = new Post();
            post.title = title;
            post.description = description;
            post.userId = user.id;
    
            const result = await AppDataSource.manager.save(post)
    
            res.status(201).json({ result });
        } catch (e: any) {
            res.status(500).json({ error: e.message })
        }
    }
    
    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await postRepository.findOneBy({ id });
            if (!data) {
                return res.status(400).json({ error: 400, message: "data not found" });
            }
            res.status(200).json({ data });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
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
            res.status(500).json({ error: e.message });
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
            res.status(200).json({ data: post });
        } catch (e: any) {
            res.status(500).json({ error: e.message });
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
            res.status(500).json({ error: e.message });
        }
    };
}

const postController = new PostController();

export default postController;
