import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

import usersRouter from "./routes/user.routes.js";

app.use("/api/v1/users", usersRouter);

export default app;
