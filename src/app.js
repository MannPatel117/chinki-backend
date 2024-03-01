import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(cookieParser())


//routes imports
import adminUserRouter from './routes/adminUser.routes.js'
import productsRouter from './routes/product.routes.js'
import offerRouter from './routes/offer.routes.js'


//routes
app.use("/api/v1/adminUser", adminUserRouter)
app.use("/api/v1/products", productsRouter)
app.use("/api/v1/offers", offerRouter)

export default app