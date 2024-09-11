import { asyncHandler } from "../utils/asyncHandler.js";
import { Inventory } from "../models/inventory.model.js";
import { MasterProduct } from "../models/masterProduct.model.js";
import { Account } from "../models/accounts.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InventoryProduct } from "../models/inventoryProducts.model.js";

/*
    Function Name - addInventory
    Functionality - Adds Inventory - Admin Only Task
*/

  const addInventory = asyncHandler(async (req, res) => {;
    const {
      location,
      mannkey
    } = req.body;
    if (mannkey != process.env.MANN_SECRET_PASSWORD) {
      return res
        .status(409)
        .json(new ApiResponse(409,"", "Key is wrong", "Unauthorized"));
    } else {
      const inventoryCreated = await Inventory.create({
        location,
        billNumber:1,
        invoiceNumber:1
      });
      if (inventoryCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, inventoryCreated, "Inventory Created Successfully", "Success")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409, "",
              "Could not add inventory, please try again later",
              "Action Failed"
            )
          );
      }
    }
  });
 
/*
    Function Name - getInventorybyLocation
    Functionality - gets Inventory details by location
*/
  
  const getInventorybyLocation = asyncHandler(async (req, res) => {
    let storelocation= req.params.location;
    const inventoryFound = await Inventory.find({
      location: storelocation
    }).select('-__v')
    if(inventoryFound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, inventoryFound, "Inventory Found Successfully", "Success")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400,"", "Something went wrong, please try again", "Action Failed")
    ); 
    }
  });

/*
    Function Name - getAllInventory
    Functionality - gets All Inventory
*/

  const getAllInventory = asyncHandler(async (req, res) => {
    const allInventory = await Inventory.find();
    if(allInventory){
        return res
          .status(200)
          .json(
            new ApiResponse(200, allInventory, "Inventory found successfully", "Success")
    );
    }
    else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "", "Something went wrong, please try again", "Action Failed")
    ); 
    }
  });

/*
    Function Name - deleteInventorybyID
    Functionality - deleted Inventory
*/

  const deleteInventorybyID = asyncHandler(async (req, res) => {
    let id= req.query?._id;
    let key=req.query?.key;
    if(key == process.env.MANN_SECRET_PASSWORD){
        const deleteInventory = await Inventory.findByIdAndDelete(
            id
          )
          if(deleteInventory){
              return res
                .status(200)
                .json(
                  new ApiResponse(200, "", "Inventory successfully deleted", "Success")
          );
          }
          else{
              return res
                .status(400)
                .json(
                  new ApiResponse(400, "", "Something went wrong, please try again", "Action Failed")
          ); 
          }
    }
    else{
        return res
        .status(409)
        .json(new ApiResponse(409, "Key is wrong", "UNAUTHORIZED"));
    }
    
  });

  /*
    Function Name - getInventoryDetails
    Functionality - Get Paginated Inventory Details with params
  */

  const getInventoryDetails = asyncHandler(async (req, res) => { 
    let status = req.query?.status?.trim();
    let search = req.query?.search?.trim();
    let location = req.query?.location?.trim();
    let supplierId = req.query?.supplierId?.trim(); 
    let lowStock = req.query?.lowStock === 'true'; 
    let pagination = req.query?.pagination === 'true';
    
    const matchConditions = {};
    
    if (status && status !== "") {
      matchConditions.status = status;
    }
    
    if (location) {
      matchConditions.location = location; 
    }
    
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    
    const options = {
      page: page,
      limit: limit
    };
    
    const pipeline = [
      {
        $match: matchConditions
      },
      {
        $lookup: {
          from: "masterproducts", 
          localField: "product",
          foreignField: "_id",
          as: "masterProduct"
        }
      },
      {
        $unwind: "$masterProduct"
      },
      {
        $project: {
          itemName: "$masterProduct.itemName", // Flatten the fields from masterProduct
          barcode: "$masterProduct.barcode",
          aliasName: "$masterProduct.aliasName",
          supplierId: "$masterProduct.supplierId", // Include supplierId directly
          location: 1,
          quantity: 1,
          lowWarning: 1,
          status: 1,
          product: 1,
        }
      }
    ];
    
    if (search && search !== "") {
      pipeline.push({
        $match: {
          $or: [
            { "itemName": { $regex: search, $options: "i" } },
            { "barcode": { $regex: search, $options: "i" } },
            { "aliasName": { $regex: search, $options: "i" } }
          ]
        }
      });
    }
    
    if (supplierId && supplierId !== "") {
      pipeline.push({
        $match: {
          "supplierId": supplierId
        }
      });
    }
    
    if (lowStock) {
      pipeline.push({
        $match: {
          $expr: { $lt: ["$quantity", "$lowWarning"] } 
        }
      });
    }
    
    let products;
    if (pagination) {
      products = await InventoryProduct.aggregatePaginate(InventoryProduct.aggregate(pipeline), options);
    } else {
      products = await InventoryProduct.aggregate(pipeline);
    }
    
    if (products) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, products, "Inventory Products fetched successfully", "Success")
        );
    } else {
      return res
        .status(500)
        .json(
          new ApiResponse(500, "", "Something went wrong", "Action Failed")
        );
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

  

  //PERFECT FUNCTIONS

  const editLowWarning= asyncHandler(async (req, res) => {
    let location= req.query?.location;
    let productId = req.body?.product;
    let updatedValue = req.body?.lowWarning;
    const inventory = await Inventory.findOneAndUpdate(
        { location: location, "inventoryProducts.product": productId },
        { $set: { "inventoryProducts.$.lowWarning": updatedValue } },
        { new: true }
    );
    if(inventory){ 
      return res
        .status(200)
        .json(
          new ApiResponse(200, inventory, "INVENTORY UPDATED")
      );        
    } else{
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Something went wrong, please try again", "ACTION FAILED")
          ); 
      }
  });

  const lowInventory = asyncHandler(async(req,res) =>{
    let storelocation= req.query.location;
    let search = req.query.search;

    //pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const inventory = await Inventory.aggregate([
      { $match: { location: storelocation } },
      { $unwind: "$inventoryProducts" },
      { 
        $match: { 
          $expr: { $lt: ["$inventoryProducts.quantity", "$inventoryProducts.lowWarning"] }
        }
      },
      {
        $lookup: {
          from: "masterproducts", // The name of the MasterProduct collection
          localField: "inventoryProducts.product", // Field from Inventory collection
          foreignField: "_id", // Field from MasterProduct collection
          as: "productDetails" // Output array field
        }
      },
      { $unwind: "$productDetails" }, // Unwind the productDetails array
      {
        // Add search functionality here
        $match: search ? { "productDetails.itemName": { $regex: search, $options: "i" } } : {}
      },
      {
        $lookup: {
          from: "accounts",
          let: { supplierId: { $toObjectId: "$productDetails.supplierId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$supplierId"] } } }
          ],
          as: "supplierDetails"
        }
      },
      { $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true } },
      { 
        $group: {
          _id: "$_id",
          location: { $first: "$location" },
          inventoryProducts: { 
            $push: {
              _id: "$productDetails._id",
              product: "$productDetails.itemName",
              quantity: "$inventoryProducts.quantity",
              lowWarning: "$inventoryProducts.lowWarning",
              supplierId: "$productDetails.supplierId",
              supplierName: "$supplierDetails.accountName",
            }
          }
        }
      },
      { 
        $project: {
          _id: 1,
          location: 1,
          productDetails: 1,
          supplierDetails: 1,
          inventoryProducts: 1
        }
      }
    ]);

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
    const totalActiveProductCount = await MasterProduct.countDocuments({ status: 'active' })
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
export { addInventory, updateBillNumber, updateInvoiceNumber, editLowWarning, getInventorybyLocation, getInventoryDetails, getAllInventory, deleteInventorybyID, lowInventory, inventoryStats };

