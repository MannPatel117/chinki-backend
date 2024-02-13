import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import app from "./app.js"

// configuring dot env
dotenv.config({
    path: './env'
})

connectDB()
.then(() =>{
    app.on("error", (error)=>{
        console.log("Error connecting to server", error)
    })
    const current_port = process.env.PORT || 8000
    app.listen(current_port, () =>{
        console.log(`Server is running at port : ${current_port}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed ", err)
})