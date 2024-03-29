import mongoose, {Schema} from "mongoose";

const offersSchema = new Schema({
    offerName:{
        type: String,
        required: true,
    },
    minimumPrice:{
        type: Number,
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterProduct'
    },
    location:[{
        type: String,
        required: [true, 'Location is required'],
        lowercase: true
    }],
    isActive:{
        type: Boolean
    },
    appliedonBill:[{
        type: String
    }]
})

export const Offer = mongoose.model("Offer", offersSchema)