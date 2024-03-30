import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { NextFunction, Request, Response } from "express";

export const logEvents = async (message: string, logName: string) => {
    const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss")
    const logItem = `${dateTime}\t${uuidv4()}\t${message}`;

    const DIR = path.join(__dirname, "..", "logs");

    try {
        if (!fs.existsSync(DIR)) {
            await fsPromises.mkdir(DIR);
        }
        await fsPromises.appendFile(path.join(DIR, logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(`${req.method}\t${req.originalUrl}\t${req.url}`, 'reqLog.txt');
    next();
}
