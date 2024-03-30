import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logEvents";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(`${error.name}: ${error.message}`, "errLog.txt");
    console.error(error.stack);
    res.status(500).send(error.message);
}

export default errorHandler;
