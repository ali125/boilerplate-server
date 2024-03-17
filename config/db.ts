import { DataSource } from "typeorm";
import { Post } from "../models/Post";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Post],
    subscribers: [],
    migrations: [],
});
