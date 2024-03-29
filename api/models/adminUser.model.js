import mongoose, {Schema} from "mongoose";
import  jwt from "jsonwebtoken";

const adminUserSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    location:{
        type: String,
        required: [true, 'Location is required'],
        unique: true,
        lowercase: true
    },
    role:{
        type: String,
        enum: ["MASTER", "STORE", "SUPER-ADMIN"],
        default: "STORE"
    },
    refreshToken: {
        type: String
    }
})

adminUserSchema.methods.generateAccessToken = function(userId){
    return jwt.sign({
        _id: userId,
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
adminUserSchema.methods.generateRefreshToken = function(userId){
    return jwt.sign({
        _id: userId,
    }, process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const AdminUser = mongoose.model("AdminUser", adminUserSchema)