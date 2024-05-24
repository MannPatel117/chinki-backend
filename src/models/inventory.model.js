import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const inventorySchema = new Schema({
    location:{
        type: String,
        required: true,
        lowercase: true
    },
    inventoryProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MasterProduct'
        },
        barcode:{
            type: String
        },
        quantity: {
            type: Number,
            default: 0 
        },
        lowWarning:{
            type: Number,
            default: 10
        }
    }],
    billNumber:{
        type: Number,
    },
    invoiceNumber:{
        type: Number,
    }
})

inventorySchema.plugin(mongooseAggregatePaginate)

export const Inventory = mongoose.model("Inventory", inventorySchema)