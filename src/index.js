import dotenv from "dotenv";
import connectDB from "./db/connection.js";

// configuring dot env
dotenv.config({
    path: './env'
})

connectDB()