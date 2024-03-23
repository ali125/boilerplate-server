import "reflect-metadata";
require("dotenv").config();
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/db";
import RootRouter from "./routes";

// Server port
const PORT = process.env.PORT || 3500;

// built-in middleware to handleurlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// boot routes
app.use(RootRouter);

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        app.listen(PORT, () => {
            console.log(`Server on running port ${PORT} \nhttp://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log(error))



