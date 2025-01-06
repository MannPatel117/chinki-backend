import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Inventory } from "./inventory.model.js";
import { InventoryProduct } from "./inventoryProducts.model.js";

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

  masterProductSchema.post("save", async function (doc) {
    try {
      const locations = await Inventory.find({}).select('location');
      for (const inventoryLocation of locations) {
        const newInventoryProduct = new InventoryProduct({
            location: inventoryLocation.location,
            product: doc._id,
            barcode: doc.barcode,
            quantity: 0, 
            status: "active"
          });
        await newInventoryProduct.save();
      }
    } catch (error) {
      console.error("Error initializing inventory products for new product:", error);
    }
  });

  masterProductSchema.post("findOneAndDelete", async function (doc) {
    try {
      // Remove all inventory products related to the product being deleted
      await InventoryProduct.deleteMany({ product: doc._id });
      next(); // Continue with the removal
    } catch (error) {
      console.error("Error deleting inventory products for product:", error);
      next(error); // Pass error to the next middleware
    }
  });

export const MasterProduct = mongoose.model("MasterProduct", masterProductSchema)