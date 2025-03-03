import express from "express";


import env from "./zod.js";
import logger from "./logger.js";


import authRoutes from "./routes/auth"
import errorHandler, { Errorr } from "./middlewares/error.middleware.js";
import { connectToDb } from "./services/mqsql/mysql.service.js";

// connection to db
connectToDb()

// initializing the router
const app = express();

app.use(express.json())

app.use('/auth', authRoutes);

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

