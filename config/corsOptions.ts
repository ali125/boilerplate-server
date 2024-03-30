import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            cb(null, true)
        } else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

export default corsOptions;
