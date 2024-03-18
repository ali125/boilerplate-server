import { DataSource } from "typeorm";
import { Post } from "../models/Post";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Post, User],
    subscribers: [],
    migrations: [],
});
