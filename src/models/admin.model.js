import mongoose, {Schema} from "mongoose";
import  jwt from "jsonwebtoken";

const adminSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
    },
    location:{
        type: String,
    },
    role:{
        type: String,
        enum: ["storemaster", "store", "superadmin", "factorymaster", "factory", "crm", "crmmaster" ],
        default: "store"
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
})

adminSchema.methods.generateAccessToken = function(userId){
    return jwt.sign({
        _id: userId,
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

export const Admin = mongoose.model("Admin", adminSchema)