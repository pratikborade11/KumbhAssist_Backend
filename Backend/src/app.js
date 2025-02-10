import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoConnect from "./db/index.js";
import "dotenv/config";
import { app, httpServer } from "./socket/socket.js";
import path from "path";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    fileUpload({
        tempFileDir: "./tmp",
        useTempFiles: true,
    })
);

import usersRouter from "./routes/user.routes.js";
import healthCheckRouter from "./routes/healthCheck.js";
import sosRouter from "./routes/sos.routes.js";
import adminRouter from "./routes/admin.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import notification from './routes/notification.route.js'

app.use("/health", healthCheckRouter); // Health check route

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/sos", sosRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/incidents", incidentRoutes);
app.use("/api/v1/notification", notification)

// for testing socket functionality only
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public", "index.html")); // Correct path to index.html
});

mongoConnect().then(() => {
    httpServer.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
