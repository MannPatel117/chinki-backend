import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const billDetailSchema = new Schema({
    barCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterProduct'
    },
    quantity: {
        type: Number,
        required: true
    }
})

const masterBillSchema = new Schema({
    invoiceNumber:{
        type: Number,
        required: [true, 'Invoice Number is required'],
        index: true
    },
    billNumber:{
        type: String,
        required: [true, 'Invoice Number is required'],
        index: true
    },
    phnNumber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerType:{
        type: String,
        enum: ["New", "Existing"],
        default: "New"
    },
    paymentType:{
        type: String,
        enum: ["Cash", "Online"],
        default: "Cash"
    },
    billDetails:{
        type: [billDetailSchema]
    },
    rewardPointsUsed: {
        type: Number,
        default: 0
    },
    finalAmt:{
        type: Number,
        min: 0
    },
    location:{
        type: String,
        required: true
    }
}, {timestamps: true})
masterBillSchema.plugin(mongooseAggregatePaginate)

export const MasterBill = mongoose.model("MasterBill", masterBillSchema)