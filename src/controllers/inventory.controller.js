import { asyncHandler } from "../utils/asyncHandler.js";
import { Inventory } from "../models/inventory.model.js";
import { MasterProduct } from "../models/masterProduct.model.js";
import { Account } from "../models/accounts.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

  const addInventory = asyncHandler(async (req, res) => {
  const inventory = req.body;
  const {
    location,
    mannkey
  } = req.body;
  let missingArray = [];
  for (const key in inventory) {
    if (inventory[key] === "" || inventory[key] === null) {
      missingArray.push(key);
    }
  }
  if (missingArray.length !== 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, missingArray, "SOME FIELDS ARE MISSING"));
  } else {
    if (mannkey != process.env.MANN_SECRET_PASSWORD) {
      return res
        .status(409)
        .json(new ApiResponse(409, "Key is wrong", "UNAUTHORIZED"));
    } else {
      const inventoryCreated = await Inventory.create({
        location,
        inventoryProduct: [],
        billNumber:0,
        invoiceNumber:0
      });
      if (inventoryCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, inventoryCreated, "INVENTORY SUCCESSFULLY CREATED")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "Could not add inventory, please try again later",
              "FAILED TO ADD INVENTORY"
            )
          );
      }
    }
  }
});

  const updateBillNumber= asyncHandler(async (req, res) => {
    let location= req.body?.location;
    let type = req.body?.type;
    let edited = req.body?.edited;
      const inventoryFound = await Inventory.find({
        location: location
      })
      if(inventoryFound){
        let currentBillNo = inventoryFound[0].billNumber;
        let updatedBillNo = 0;
        let trueValue = false;
        if(type == "add"){
          updatedBillNo = currentBillNo+1;
          trueValue=true;
        }
        else if(type == "edit"){
          updatedBillNo = edited;
          trueValue=true;
        }
        else{
          return res
            .status(400)
            .json(
              new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
          );
        }
        if(trueValue){
          const update ={
            "billNumber": updatedBillNo
          }
          let id=inventoryFound[0]._id;
          const updatedBillNumber = await Inventory.findByIdAndUpdate(
            id,
            {
                $set: update
            },
            {
                new: true
            }
          )
          return res
            .status(200)
            .json(
              new ApiResponse(200, updatedBillNumber, "INVENTORY UPDATED")
          );
        }      
      }
      else{
          return res
            .status(400)
            .json(
              new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
      ); 
      }
  });

  const updateInvoiceNumber= asyncHandler(async (req, res) => {
    let location= req.body?.location;
    let type = req.body?.type;
    let edited = req.body?.edited;
      const inventoryFound = await Inventory.find({
        location: location
      })
      if(inventoryFound){
        let currentInvoiceNo = inventoryFound[0].invoiceNumber;
        let updatedInvoiceNo = 0;
        let trueValue = false;
        if(type == "add"){
          updatedInvoiceNo = currentInvoiceNo+1;
          trueValue=true;
        }
        else if(type == "edit"){
          updatedInvoiceNo = edited;
          trueValue=true;
        }
        else{
          return res
            .status(400)
            .json(
              new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
          );
        }
        if(trueValue){
          const update ={
            "invoiceNumber": updatedInvoiceNo
          }
          let id=inventoryFound[0]._id;
          const updatedInvoiceNumber = await Inventory.findByIdAndUpdate(
            id,
            {
                $set: update
            },
            {
                new: true
            }
          )
          return res
            .status(200)
            .json(
              new ApiResponse(200, updatedInvoiceNumber, "INVENTORY UPDATED")
          );
        }      
      }
      else{
          return res
            .status(400)
            .json(
              new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
      ); 
      }
  });

  const editLowWarning= asyncHandler(async (req, res) => {
    let location= req.body?.location;
    let productId = req.body?.product;
    let updatedValue = req.body?.lowWarning;
      const inventoryFound = await Inventory.find({
        location: location
      })
      if(inventoryFound){ 
          let currentInventory = inventoryFound[0].inventoryProducts;
          for(let i=0; i<currentInventory.length; i++){
            if(currentInventory[i].product == productId){
              currentInventory[i].lowWarning = updatedValue
            }
          }
          const updatedInventory = await Inventory.findByIdAndUpdate(
            inventoryFound[0]._id,
            {
                $set: {
                  inventoryProducts:currentInventory
                }
            },
            {
                new: true
            }
          )
          return res
            .status(200)
            .json(
              new ApiResponse(200, updatedInventory, "INVENTORY UPDATED")
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

  const getInventorybyLocation = asyncHandler(async (req, res) => {
    let storelocation= req.query.location;
    const inventoryFound = await Inventory.find({
      location: storelocation
    }).select('-inventoryProducts -__v')
    if(inventoryFound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, inventoryFound, "INVENTORY FOUND")
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

  const getInventoryDetailsbyLocation = asyncHandler(async (req, res) => {
    let storelocation= req.query.location;
    const inventoryFound = await Inventory.find({
      location: storelocation
    }).select('-__v')
    if(inventoryFound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, inventoryFound, "INVENTORY FOUND")
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

  const getAllInventory = asyncHandler(async (req, res) => {
    const allInventory = await Inventory.find();
    if(allInventory){
        return res
          .status(200)
          .json(
            new ApiResponse(200, allInventory, "Inventory FOUND")
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

  const deleteInventorybyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    let key=req.body?.key;
    if(key == process.env.MANN_SECRET_PASSWORD){
        const deleteInventory = await Inventory.findByIdAndDelete(
            id
          )
          if(deleteInventory){
              return res
                .status(200)
                .json(
                  new ApiResponse(200, "Inventory successfully deleted", "Inventory DELETED")
          );
          }
          else{
              return res
                .status(400)
                .json(
                  new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
          ); 
          }
    }
    else{
        return res
        .status(409)
        .json(new ApiResponse(409, "Key is wrong", "UNAUTHORIZED"));
    }
    
  });

  //PERFECT FUNCTIONS

  const lowInventory = asyncHandler(async(req,res) =>{
    let storelocation= req.query.location;
    const inventory = await Inventory.aggregate([
      { $match: { location: storelocation } },
      { $unwind: "$inventoryProducts" },
      { 
        $match: { 
          $expr: { $lt: ["$inventoryProducts.quantity", "$inventoryProducts.lowWarning"] }
        }
      },
      { 
        $group: {
            _id: "$_id",
            location: { $first: "$location" },
            inventoryProducts: { $push: "$inventoryProducts" }
        }
      },
      {
        $project: {
          _id: 1,
          location: 1,
          inventoryProducts: 1
        }
      }
    ]);
    console.log(inventory)
    if(inventory){
      return res
        .status(200)
        .json(
          new ApiResponse(200, inventory, "Low Stock Inventory Found")
      );
    }
    else{
      return res
      .status(400)
      .json(
        new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
      ); 
    }
  })

  const inventoryStats = asyncHandler(async(req,res) =>{
    let storelocation= req.query.location;
    const lowStockCount = await getLowStockCount(storelocation);
    const totalActiveProductCount = await MasterProduct.countDocuments({ status: 'ACTIVE' })
    const totalProductCount = await MasterProduct.countDocuments({});
    const totalAccountCount = await Account.countDocuments({});
    const result = {
      'lowStockCount': lowStockCount,
      'totalActiveProductCount': totalActiveProductCount,
      'totalProductCount' : totalProductCount,
      'totalAccountCount' : totalAccountCount
    }
    if(lowStockCount && totalActiveProductCount && totalProductCount && totalAccountCount){
      return res
        .status(200)
        .json(
          new ApiResponse(200, result, "Inventory Stats")
      );
    }
    else{
      return res
      .status(400)
      .json(
        new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
      ); 
    }
  })

  async function getLowStockCount(storeLocation){
    const inventory = await Inventory.aggregate([
      { $match: { location: storeLocation } },
      { $unwind: "$inventoryProducts" },
      { 
        $match: { 
          $expr: { $lt: ["$inventoryProducts.quantity", "$inventoryProducts.lowWarning"] }
        }
      },
      { 
        $group: {
          _id: null,
          lowInventoryCount: { $sum: 1 }
        }
      },
      {
        $project: {
            _id: 0,
            lowInventoryCount: 1
        }
      }
    ]);
    return inventory[0].lowInventoryCount
  }



// editLowWarning
export { addInventory, updateBillNumber, updateInvoiceNumber, editLowWarning, getInventorybyLocation, getInventoryDetailsbyLocation, getAllInventory, deleteInventorybyID, lowInventory, inventoryStats };

