import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { InventoryProduct } from "./inventoryProducts.model.js";
import { MasterProduct } from "./masterProduct.model.js";

const inventorySchema = new Schema({
    location:{
        type: String,
        required: true,
        lowercase: true
    },
    billNumber:{
        type: Number,
    },
    invoiceNumber:{
        type: Number,
    }
})

inventorySchema.plugin(mongooseAggregatePaginate)

  inventorySchema.post("save", async function (doc) {
    try {
      const location = doc.location;
      const products = await MasterProduct.find({ status: 'active' }).select('barcode _id');
      for (const product of products) {
        const newInventoryProduct = new InventoryProduct({
            location: location,
            product: product._id,
            barcode: product.barcode,
            quantity: 0, 
            status: "active"
          });
        await newInventoryProduct.save();
      }
    } catch (error) {
      console.error("Error initializing inventory products for new product:", error);
    }
  });

  inventorySchema.post("findOneAndDelete", async function (doc) {
    try {
      await InventoryProduct.deleteMany({ location: doc.location });
    } catch (error) {
      console.error("Error deleting inventory products for product:", error);
    }
  });

export const Inventory = mongoose.model("Inventory", inventorySchema)