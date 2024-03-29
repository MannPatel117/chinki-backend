import { asyncHandler } from "../utils/asyncHandler.js";
import { MasterBill } from "../models/masterBill.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js"
import { MasterProduct } from "../models/masterProduct.model.js";

const addMasterBill = asyncHandler(async (req, res) => {
    const transaction = req.body;
    const {
      invoiceNumber,
      billNumber,
      phnNumber,
      customerType,
      paymentType,
      billDetails,
      rewardPointsUsed,
      finalAmt,
      location
    } = req.body;
    let missingArray = [];
    for (const key in transaction) {
      if (transaction[key] === "" || transaction[key] === null) {
        missingArray.push(key);
      }
    }
    if (missingArray.length !== 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, missingArray, "SOME FIELDS ARE MISSING"));
    } else {
      const inventoryExists = await Inventory.find({ location:location });
      if(inventoryExists.length == 1){
        const currentProducts = inventoryExists[0].inventoryProducts;
        const inventoryObject = {};

        currentProducts.forEach(item => {
            inventoryObject[String(item.product)] = item;
        });

        for (const barcodeItem of billDetails) {
          const productId = String(barcodeItem.barCode);
          const inventoryItemIndex = currentProducts.findIndex(item => String(item.product) === productId);
          if (inventoryItemIndex !== -1) {
              currentProducts[inventoryItemIndex].quantity -= barcodeItem.quantity;
          } else {
              try {
                  const productSchema = await MasterProduct.findById(barcodeItem.barCode);
                  const prod = {
                      product: productSchema._id,
                      quantity: -(barcodeItem.quantity)
                  };
                  currentProducts.push(prod);
              } catch (error) {
                  console.error("Error fetching product:", error);
              }
          }
        }
    //   const updatedInventory = await Inventory.findByIdAndUpdate(
    //           inventoryExists[0]._id,
    //           {
    //               $set: {
    //                 inventoryProducts:currentProducts
    //               }    
    //           },{
    //               new: true
    //           }
    //       )   
    console.log(currentProducts)
      }

        // const accountTransactionCreated = await accountTransaction.create({
        //   challanNumber,
        //   challanDate,
        //   documentNumber,
        //   supplier,
        //   billNumber,
        //   billDate,
        //   transactionType,
        //   paymentType: "",
        //   billDetails,
        //   chequeno: "",
        //   chequeDate: "",
        //   finalAmt,
        //   location
        // });
        if (true) {
          return res
            .status(201)
            .json(
              new ApiResponse(201, true, "ACCOUNT TRANSACTION RECORDED")
            );
        } 
        else {
          return res
            .status(409)
            .json(
              new ApiResponse(
                409,
                "Could not add account transaction, please try again later",
                "FAILED TO ADD ACCOUNT TRANSACTION"
              )
            );
        }
      }
  });

  export { addMasterBill };