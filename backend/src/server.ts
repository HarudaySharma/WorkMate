import express from "express";
import cookieParser from "cookie-parser";


import env from "./zod.js";
import logger from "./logger.js";


import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import workSpaceRoutes from "./routes/workspace"

import errorHandler, { Errorr } from "./middlewares/error.middleware.js";
import db from "./services/mqsql/mysql.service.js";


db.initializeDatabase()

// initializing the router
const app = express();


app.use(express.json())
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workspace', workSpaceRoutes);

app.use("*", (_, __, next) => {
    next(new Errorr("Not found", 404))
})

app.use(errorHandler)


// starting the server
const PORT = env.PORT
app.listen(PORT, (err) => {
    if (err) {
        logger.fatal(`failed to start the server at PORT: ${PORT}`)
        return
    }
    logger.info(`server running on http://localhost:${PORT}`)
})


process.on("SIGINT", async () => {
    await db.close();
    process.exit(0);
});

