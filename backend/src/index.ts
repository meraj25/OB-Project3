import express from "express";
import cors from "cors"
import {} from "./db/prisma"
import cookieParser from "cookie-parser";
import globalErrorHandlingMiddleware from "./middlewares/global-error-handling.middleware";
import UserRouter from "./routes/users.route";



const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

app.use(cors({origin:"http://localhost:5173",  credentials: true}));

app.use(cookieParser());

app.use('/api/users',UserRouter);

app.use(globalErrorHandlingMiddleware);

const PORT = 8000;

app.listen(PORT, () => {

    console.log(`server is running on ${PORT}`)
})

export default app;

