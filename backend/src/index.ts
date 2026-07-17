import express from "express";
import cors from "cors"
import {} from "./db/prisma"


const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

app.use(cors({origin:"http://localhost:5173",  credentials: true}));


const PORT = 8000;

app.listen(PORT, () => {

    console.log(`server is running on ${PORT}`)
})

export default app;

