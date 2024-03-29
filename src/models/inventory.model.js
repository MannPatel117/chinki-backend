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
        default: 0
    },
    invoiceNumber:{
        type: Number,
        default: 0
    }
})

inventorySchema.plugin(mongooseAggregatePaginate)

export const Inventory = mongoose.model("Inventory", inventorySchema)