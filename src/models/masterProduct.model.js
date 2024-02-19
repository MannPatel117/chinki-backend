import mongoose, {Schema} from "mongoose";

const masterProductSchema = new Schema({
    itemName:{
        type: String,
        required: [true, 'Item name is required'],
        unique: true,
        uppercase: true,
        index: true
    },
    aliasName:{
        type: String,
        uppercase: true,
        index: true
    },
    barcode:{
        type: String,
        required: [true, 'Barcode is required'],
        unique: true,
        index: true
    },
    productType:{
        type: String,
        enum: ["Finished", "Estimated"],
        default: "store"
    },
    unit:{
        type: String,
        uppercase: true
    },
    mrp:{
        type: Number,
        min: 0
    },
    discount:{
        type: Number,
        min: 0,
        max: 100
    },
    sellingPrice:{
        type: Number,
        min:0
    },
    wholeSalePrice:{
        type: Number,
        min: 0
    },
    gst:{
        type: Number,
        min: 0,
        max:100
    },
    hsnCode:{
        type: String
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
})

export const MasterProduct = mongoose.model("MasterProduct", masterProductSchema)