import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const AddressSchema = new Schema({
    addressLine1: {
        type: String
    },
    addressLine2: {
        type: String
    },
    addressLine3: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: Number
    }
})

const rewardHistorySchema = new Schema({
    pointsUsed:{
        type: Number
    },
    billNumber:{
        type: Number
    }
}, {timestamps: true})

const userSchema = new Schema({
    name:{
        type: String
    },
    phone_Number:{
        type: String,
        required: [true, 'Phone number is required'],
        index: true
    },
    address:{
        type: AddressSchema
    },
    rewardPoint:{
        type: Number,
        default: 0
    },
    rewardPointsHistory:{
        type: [rewardHistorySchema]
    },
    totalTransaction:{
        type: Number,
        default: 0
    }
}, {timestamps: true})

userSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model("User", userSchema)