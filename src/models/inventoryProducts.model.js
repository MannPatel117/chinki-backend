import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const inventorytHistorySchema = new Schema({
  quantity:{
    type: Number
  },
  billID:{
    type: Number
  },
  type:{
    type: String
  }
}, {timestamps: true})

const inventoryProductSchema = new Schema({
  location: {
    type: String,
    index: true, // Index on location for efficient querying
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterProduct",
  },
  quantity: {
    type: Number,
    default: 0, 
  },
  lowWarning: {
    type: Number,
    default: 20,
  },
  status:{
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  supplierId:{
    type: [String],
    default: []
  },
  history:{
    type: [inventorytHistorySchema]
  }
});

// Plugin to enable pagination on inventory products
inventoryProductSchema.plugin(mongooseAggregatePaginate);

export const InventoryProduct = mongoose.model("InventoryProduct", inventoryProductSchema);