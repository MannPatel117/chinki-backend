import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const billDetailSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterProduct'
    },
    quantity: {
        type: Number
    },
    mrp: {
        type: Number
    },
    discount: {
        type: Number
    },
    rate: {
        type: Number
    },
    amount: {
        type: Number
    },
    gst: {
        type: Number
    },
    gstAmount: {
        type: Number
    },
    finalAmount:{
        type: Number
    }
})

const OfferSchema = new Schema({
    offer_id: {
        type: String,
    },
    offer_name:{
        type: String,
    },
    product_id:{
        type: String,
    },
    mrp: {
        type: Number
    }
})

const BillSchema = new Schema({
    invoiceNumber:{
        type: Number,
    },
    billNumber:{
        type: Number,
        required: [true, 'Bill Number is required'],
        index: true
    },
    phnNumber:{
        type: String,
    },
    customerType:{
        type: String,
        enum: ["New", "Existing"],
        default: "New"
    },
    paymentType:{
        type: String,
        enum: ["cash", "upi"],
        default: "cash"
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
    },
    offerApplied:{
        type: OfferSchema
    }
}, {timestamps: true})

BillSchema.plugin(mongooseAggregatePaginate)

export const Bill = mongoose.model("Bill", BillSchema)