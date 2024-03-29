import { asyncHandler } from "../utils/asyncHandler.js";
import { accountTransaction } from "../models/accountsTransaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js"
import { MasterProduct } from "../models/masterProduct.model.js";

  const addTransactionSupply = asyncHandler(async (req, res) => {
    const transaction = req.body;
    const {
      challanNumber,
      challanDate,
      documentNumber,
      supplier,
      billNumber,
      billDate,
      transactionType,
      billDetails,
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
              currentProducts[inventoryItemIndex].quantity += barcodeItem.quantity;
          } else {
              try {
                  const productSchema = await MasterProduct.findById(barcodeItem.barCode);
                  const prod = {
                      product: productSchema._id,
                      quantity: barcodeItem.quantity
                  };
                  currentProducts.push(prod);
              } catch (error) {
                  console.error("Error fetching product:", error);
              }
          }
        }
      const updatedInventory = await Inventory.findByIdAndUpdate(
              inventoryExists[0]._id,
              {
                  $set: {
                    inventoryProducts:currentProducts
                  }    
              },{
                  new: true
              }
          )   
      }

        const accountTransactionCreated = await accountTransaction.create({
          challanNumber,
          challanDate,
          documentNumber,
          supplier,
          billNumber,
          billDate,
          transactionType,
          paymentType: "",
          billDetails,
          chequeno: "",
          chequeDate: "",
          finalAmt,
          location
        });
        if (accountTransactionCreated) {
          return res
            .status(201)
            .json(
              new ApiResponse(201, accountTransactionCreated, "ACCOUNT TRANSACTION RECORDED")
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

  const addTransactionPayment = asyncHandler(async (req, res) => {
    const transaction = req.body;
    const {
      challanNumber,
      challanDate,
      documentNumber,
      supplier,
      billNumber,
      billDate,
      transactionType,
      paymentType,
      chequeNo,
      chequeDate,
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
      const accountTransactionCreated = await accountTransaction.create({
        challanNumber,
        challanDate,
        documentNumber,
        supplier,
        billNumber,
        billDate,
        transactionType,
        paymentType,
        billDetails: [],
        chequeNo,
        chequeDate,
        finalAmt,
        location
      });
      if (accountTransactionCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, accountTransactionCreated, "ACCOUNT TRANSACTION RECORDED")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "Could not add account transaction, please try again later",
              "FAILED TO ADD TRANSACTION RECORD"
            )
          );
      }
    }
  });

  const editTransactionSupply = asyncHandler(async (req, res) => {
    const transactionReq = req.body;
    let id= transactionReq?._id;
    delete transactionReq._id;
    let curr_location=transactionReq?.location;
    delete transactionReq?.location;
    if(transactionReq.billDetails){
      const inventoryExists = await Inventory.find({ location:curr_location });
      const currentProducts = inventoryExists[0].inventoryProducts;
      const inventoryObject = {};
      currentProducts.forEach(item => {
          inventoryObject[String(item.product)] = item;
      });
      for (const barcodeItem of transactionReq.billDetails) {
        const productId = String(barcodeItem.barCode);
        const inventoryItemIndex = currentProducts.findIndex(item => String(item.product) === productId);
        if (inventoryItemIndex !== -1) {
          currentProducts[inventoryItemIndex].quantity=(currentProducts[inventoryItemIndex].quantity + barcodeItem.quantity) - barcodeItem.current;
        }
      }
  
      const updatedInventory = await Inventory.findByIdAndUpdate(
        inventoryExists[0]._id,
        {
            $set: {
              inventoryProducts:currentProducts
            }    
        },{
            new: true
        }
      )
      console.log(updatedInventory)
      const currentTransaction = await accountTransaction.findById(id);
      const currentBillDetails = currentTransaction.billDetails;
      for(let i=0; i < transactionReq.billDetails.length; i++){
        for(let j=0; j< currentBillDetails.length; j++){
          if(transactionReq.billDetails[i].barCode == currentBillDetails[j].barCode){
            currentBillDetails[j].quantity = transactionReq.billDetails[i].quantity;
          }
        }
      }
      transactionReq.billDetails = currentBillDetails;
    }
    
    const updatedAccountTransaction = await accountTransaction.findByIdAndUpdate(
      id,
      {
          $set: transactionReq
      },
      {
          new: true
      }
    )
    return res
          .status(200)
          .json(
            new ApiResponse(200, updatedAccountTransaction, "ACCOUNT SUCCESSFULLY UPDATED")
          );
  });

  const editTransactionPayment = asyncHandler(async (req, res) => {
    const transactionReq = req.body;
    let id= transactionReq?._id;
    delete transactionReq._id;
    const updatedAccountTransaction = await accountTransaction.findByIdAndUpdate(
      id,
      {
          $set: transactionReq
      },
      {
          new: true
      }
    )
    return res
          .status(200)
          .json(
            new ApiResponse(200, updatedAccountTransaction, "ACCOUNT SUCCESSFULLY UPDATED")
          );
  });

  const getTransactionbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const accountTransactionFound = await accountTransaction.findById(
      id
    )
    if(accountTransactionFound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, accountTransactionFound, "ACCOUNT TRANSACTION FOUND")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });
  
  const getAllTransaction = asyncHandler(async (req, res) => {
    const accountsTransaction = await accountTransaction.find();
    if(accountsTransaction){
        return res
          .status(200)
          .json(
            new ApiResponse(200, accountsTransaction, "ACCOUNTS TRANSACTION FOUND")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });

  const deleteTransactionbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const deleteAccountTransaction = await accountTransaction.findByIdAndDelete(
      id
    )
    if(deleteAccountTransaction){
        return res
          .status(200)
          .json(
            new ApiResponse(200, "Account Transaction successfully deleted", "ACCOUNT TRANSACTION DELETED")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
    ); 
    }
  });

export { addTransactionSupply, addTransactionPayment, editTransactionSupply, editTransactionPayment, getTransactionbyID, getAllTransaction, deleteTransactionbyID };

