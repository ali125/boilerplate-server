import express from "express";
const app = express();
import RootRouter from "./routes";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Post } from "./models/Post";
require("dotenv").config();

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
})


// Server port
const PORT = process.env.PORT || 3500;

// boot routes
app.use(RootRouter);

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))


app.listen(PORT, () => {
    console.log(`Server on running port ${PORT} \nhttp://localhost:${PORT}`);
});
