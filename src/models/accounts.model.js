import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const supplierAddressSchema = new Schema({
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

const accountSchema = new Schema({
    supplierID:{
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        index: true
    },
    accountName:{
        type: String,
        required: [true, 'Account Name is required'],
    },
    aliasName:{
        type: String,
    },
    phone_Number:{
        type: String,
        required: [true, 'Phone number is required']
    },
    address:{
        type: supplierAddressSchema
    },
    subGroup:{
        type: String,
        enum: ["Sundry Creditors", "Sundry Debtors"],
        default: "Sundry Creditors"
    },
    underGroup:{
        type: String,
    },
    paymentTerm:{
        type: Number,
        default: 0
    },
    gstNumber:{
        type: String,
    },
    balance:{
        openingBalanceCredit:{
            type: Number,
            default: 0
        },
        openingBalanceDebit:{
            type: Number,
            default: 0
        }
    },
    email:{
        type: String
    }
})

accountSchema.plugin(mongooseAggregatePaginate)

export const Account = mongoose.model("Account", accountSchema)