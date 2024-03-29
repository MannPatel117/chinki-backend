import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors())

app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).send("Hello From Chinki");
});
//routes imports
import adminUserRouter from './routes/adminUser.routes.js'
import productsRouter from './routes/product.routes.js'
import offerRouter from './routes/offer.routes.js'
import accountRouter from './routes/account.routes.js'
import accountTransaction from './routes/accountsTransaction.routes.js'
import inventory from './routes/inventory.routes.js'
import users from './routes/users.routes.js'
import bill from './routes/masterBill.routes.js'

//routes
app.use("/api/v1/adminUser", adminUserRouter)
app.use("/api/v1/products", productsRouter)
app.use("/api/v1/offers", offerRouter)
app.use("/api/v1/accounts", accountRouter)
app.use("/api/v1/accountsTransaction", accountTransaction)
app.use("/api/v1/inventory", inventory)
app.use("/api/v1/users", users)
app.use("/api/v1/masterBill", bill)

export default app