import { asyncHandler } from "../utils/asyncHandler.js";
import { MasterBill } from "../models/masterBill.model.js";
import { Bill } from "../models/bill.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js"
import { MasterProduct } from "../models/masterProduct.model.js";
import { User } from "../models/user.model.js";
import { Offer } from "../models/offers.model.js";
const addMasterBill = asyncHandler(async (req, res) => {
    const {
      totalAmount,
      UserPhnNumber,
      RedeemPoints,
      CustomerType,
      PaymentType,
      currentOffer,
      BillDetails,
      location
    } = req.body;
    const inventoryFound = await Inventory.find({
      location: location
    }).select('-inventoryProducts -__v')
    let invoiceNumber = inventoryFound[0].invoiceNumber;
    let billNumber = inventoryFound[0].billNumber;
    const offer = currentOffer;
    delete offer.minimumPrice;
    delete offer.location;
    delete offer.__v;

    const {Finished, Estimated, FinishAmount} = await checkEstimated(totalAmount, BillDetails);
    if(Finished.length > 0 && Estimated.length >= 0){
        const BillCreated = await MasterBill.create({
        invoiceNumber: invoiceNumber,
        billNumber: billNumber,
        phnNumber: UserPhnNumber,
        customerType: CustomerType,
        paymentType: PaymentType,
        billDetails: Finished,
        rewardPointsUsed: RedeemPoints,
        finalAmt:FinishAmount,
        location,
        offerApplied: {
          offer_id: offer._id,
          offer_name: offer.offerName,
          product_id: offer.product,
          mrp:offer.mrp
        }
      })
    }
    else if(Finished.length == 0 && Estimated.length > 0){
      invoiceNumber = 0;
    }
    const masterBillCreated = await MasterBill.create({
      invoiceNumber: invoiceNumber,
      billNumber: billNumber,
      phnNumber: UserPhnNumber,
      customerType: CustomerType,
      paymentType: PaymentType,
      billDetails: BillDetails,
      rewardPointsUsed: RedeemPoints,
      finalAmt:totalAmount,
      location,
      offerApplied: {
        offer_id: offer._id,
        offer_name: offer.offerName,
        product_id: offer.product,
        mrp:offer.mrp
      }
    })
    if(masterBillCreated){
      const isInventoryUpdated = await updateInventory(location, BillDetails, invoiceNumber)
      if(isInventoryUpdated){
        if(UserPhnNumber !=""){
          const isUserUpdated = await updateUser(UserPhnNumber, RedeemPoints, totalAmount, billNumber);
          if(isUserUpdated){
            //update offers
            if(offer._id != ""){
              await Offer.updateOne(
                { _id: offer._id }, 
                {
                    $push: { appliedonBill: billNumber }, 
                }
              );
            }  
            return res
                .status(201)
                .json(
                  new ApiResponse(201, true, "BILL SAVED")
            );
          }else{
            return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "please try again later",
              "FAILED"
            )
          );
          }
        }else{
          if(offer._id != ""){
            await Offer.updateOne(
              { _id: offer._id }, 
              {
                  $push: { appliedonBill: billNumber }, 
              }
            );
          }
          return res
                .status(201)
                .json(
                  new ApiResponse(201, true, "BILL SAVED")
            ); 
        }
      }else{
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "please try again later",
              "FAILED"
            )
          );
      }
    } else {
      return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "Could not add bill, please try again later",
              "FAILED TO ADD BILL"
            )
          );
    }
    
    /*
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

      */
    
  });

  async function checkEstimated(totalAmount, BillDetails){
    let Finished = [];
    let Estimated = [];
    let FinishAmount = totalAmount;
    for(let product of BillDetails){
      if(product.productType == 'Finished'){
        Finished.push(product)
      } else{
        Estimated.push(product)
      }
    }
    if(Estimated.length > 0){
      for(let estimate of Estimated){
        FinishAmount = FinishAmount - estimate.finalAmount;
      }
    }
    return {Finished, Estimated, FinishAmount} ;
  }

  async function updateInventory(location, billData, invoiceNumber){
    const inventoryExists = await Inventory.find({ location:location });
    if(inventoryExists.length == 1){
      const currentProducts = inventoryExists[0].inventoryProducts;
      const inventoryObject = {};
      currentProducts.forEach(item => {
        inventoryObject[String(item.product)] = item;
      });
      for(const data of billData){
        const productId = String(data._id);
        const inventoryItemIndex = currentProducts.findIndex(item => String(item.product) === productId);
        if (inventoryItemIndex !== -1) {
          currentProducts[inventoryItemIndex].quantity -= data.quantity;
        } else{
          const productSchema = await MasterProduct.findById(data._id);
          const prod = {
              product: productSchema._id,
              quantity: -(data.quantity)
          };
          currentProducts.push(prod);
        }
      }
      const updatedInventory = await Inventory.findByIdAndUpdate(
        inventoryExists[0]._id,
        {
          $set:{
            inventoryProducts:currentProducts
          }
        },{
          new:true
        }
      )
      if(invoiceNumber == 0){
        await Inventory.updateOne(
          { _id: inventoryExists[0]._id }, // Find the document by its ID
          {
              $inc: {
                  billNumber: 1     // Increment billNumber by 1
              }
          }
        );
      } else{
        await Inventory.updateOne(
          { _id: inventoryExists[0]._id }, // Find the document by its ID
          {
              $inc: {
                  invoiceNumber: 1, // Increment invoiceNumber by 1
                  billNumber: 1     // Increment billNumber by 1
              }
          }
        );
      }
      return true;
    }
    else{
      return false;
    }
  }

  async function updateUser(phnNumber, redeemedPoints, totalAmount, billNumber){
    const user = await User.find({phone_Number: phnNumber});
    if(redeemedPoints > 0){
      let newHistory = {
        billNumber: billNumber,
        pointsUsed: -redeemedPoints
      }
      await User.updateOne(
        { phone_Number: phnNumber }, 
        { $push: { rewardPointsHistory: newHistory } }
      );
    }
    let earnedPoints = totalAmount *0.01;
    let newRewardHistory = {
      billNumber: billNumber,
      pointsUsed: earnedPoints
    }
    await User.updateOne(
      { phone_Number: phnNumber }, // Find the user by ID
      {
          $push: { rewardPointsHistory: newRewardHistory }, // Add new reward history entry
          $inc: {
              rewardPoint: earnedPoints, // Decrease reward points by pointsUsed
              totalTransaction: totalAmount // Increase total transaction amount
          }
      }
    );
    return true;
  }

  export { addMasterBill };