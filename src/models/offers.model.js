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

})

export const OfferUser = mongoose.model("OfferUser", offersSchema)