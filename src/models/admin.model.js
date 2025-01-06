import mongoose, {Schema} from "mongoose";
import  jwt from "jsonwebtoken";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        enum: ["storemaster", "store", "superadmin", "factorymaster", "factory", "crm", "crmmaster", "admin" ],
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
        _role: role,
        _location: location
    }, process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

adminSchema.plugin(mongooseAggregatePaginate)

export const Admin = mongoose.model("Admin", adminSchema)