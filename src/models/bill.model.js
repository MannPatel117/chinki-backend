import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const finishedBillDetailSchema = new Schema({
    barCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterProduct'
    },
    quantity: {
        type: Number,
        required: true
    }
})

const BillSchema = new Schema({
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
        type: Number
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
        type: [finishedBillDetailSchema]
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

BillSchema.plugin(mongooseAggregatePaginate)

export const Bill = mongoose.model("Bill", BillSchema)