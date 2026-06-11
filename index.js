import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"; 
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import seedAdmin from "./utils/adminSeeder.js";
import authRoutes from "./routes/auth.routes.js"
import classRoutes from "./routes/class.routes.js"


dotenv.config();
const app = express();

// DB Connection
connectDB()

//SEED ADMIN
seedAdmin()

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(helmet());
app.use(morgan("dev"));

// Test Route

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})

//API ENDPOINTS
app.use("/api/auth",authRoutes)
app.use("/api/class",classRoutes)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


