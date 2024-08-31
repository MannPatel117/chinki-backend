import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const masterProductSchema = new Schema({
    itemName:{
        type: String,
        unique: true
    },
    aliasName:{
        type: String,
        index: true
    },
    barcode:{
        type: String,
        unique: true
    },
    productType:{
        type: String,
        enum: ["finished", "estimated"],
        default: "finished"
    },
    img:{
        type: String
    },
    supplierId:{
        type: [String]
    },
    mrp:{
        type: Number,
    },
    discount:{
        type: Number,
    },
    sellingPrice:{
        type: Number,
    },
    wholeSalePrice:{
        type: Number,
    },
    gst:{
        type: Number,
    },
    hsnCode:{
        type: String
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
})

masterProductSchema.plugin(mongooseAggregatePaginate)

export const MasterProduct = mongoose.model("MasterProduct", masterProductSchema)