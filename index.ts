import express from "express";
const app = express();
import RootRouter from "./routes";

// Server port
const PORT = process.env.PORT || 3500;

// boot routes
app.use(RootRouter);

app.listen(PORT, () => {
    console.log(`Server on running port ${PORT} \nhttp://localhost:${PORT}`);
});
