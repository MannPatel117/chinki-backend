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

const accountsTransactionSchema = new Schema({
    challanNumber:{
        type: String,
    },
    challanDate:{
        type: Date
    },
    documentNumber:{
        type: String,
    },
    supplier:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Account'
    },
    billNumber:{
        type: String,
        required: [true, 'Invoice Number is required'],
        index: true
    },
    billDate:{
        type: Date
    },
    transactionType:{
        type: String,
        enum: ["Supply", "Payment"],
        default: "Supply"
    },
    paymentType:{
        type: String,
        enum: ["Cash", "Online", "Cheque"],
        default: "Cash"
    },
    billDetails:{
        type: [billDetailSchema]
    },
    chequeNo:{
        type: String,
    },
    chequeDate:{
        type: Date
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

accountsTransactionSchema.plugin(mongooseAggregatePaginate)

export const accountTransaction = mongoose.model("accountTransaction", accountsTransactionSchema)