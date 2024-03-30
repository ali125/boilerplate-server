import "reflect-metadata";
require("dotenv").config();
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/db";
import RootRouter from "./routes";
import { logger } from "./middleware/logEvents";
import errorHandler from "./middleware/errorHandler";
import credentials from "./middleware/credentials";
import corsOptions from "./config/corsOptions";

// Server port
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handleurlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// boot routes
app.use(RootRouter);

// custom error handler
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        app.listen(PORT, () => {
            console.log(`Server on running port ${PORT} \nhttp://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log(error))



