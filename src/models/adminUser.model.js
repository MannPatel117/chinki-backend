import mongoose, {Schema} from "mongoose";

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
        enum: ["MASTER", "STORE"],
        default: "STORE"
    },
    refreshToken: {
        type: String
    }
})

export const AdminUser = mongoose.model("AdminUser", adminUserSchema)