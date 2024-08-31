import { asyncHandler } from "../utils/asyncHandler.js";
import { MasterProduct } from "../models/masterProduct.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/*
    Function Name - addProduct
    Functionality - Creates Product
*/
  const addProduct = asyncHandler(async (req, res) => {
    const {
      itemName,
      aliasName,
      barcode,
      productType,
      unit,
      mrp,
      discount,
      sellingPrice,
      wholeSalePrice,
      gst,
      hsnCode
    } = req.body;
    const productExists = await MasterProduct.findOne({
      $or: [{ itemName }, { aliasName }, { barcode }],
    });
    if (productExists) {
      return res
        .status(409)
        .json(new ApiResponse(409, "", "Product already exists", "Invalid Action"));
    } else {
      const productCreated = await MasterProduct.create({
        itemName,
        aliasName,
        barcode,
        productType,
        img : "/products/product",
        supplierId: [],
        mrp,
        discount,
        sellingPrice,
        wholeSalePrice,
        gst,
        hsnCode,
        status: "active"
      });
      if (productCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, productCreated, "Product created", "Success")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(409,"", "Could not add product, please try again later", "Action failed")
          );
      }
    }
  });

/*
    Function Name - editProduct
    Functionality - Edit Product Details
*/

  const editProduct = asyncHandler(async (req, res) => {
    const patch = req.body;
    const id = req.query.id;  
    const updatedProduct = await MasterProduct.findOneAndUpdate(
      { _id: id },
      { $set: patch },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully", "Success"));
  });

/*
    Function Name - getProductbyID
    Functionality - Get Product by specific id
*/

  const getProductbyID = asyncHandler(async (req, res) => {
    let id= req.params.id;
    const Product = await MasterProduct.findById(
      id
    )
    if(Product){
        return res
          .status(200)
          .json(
            new ApiResponse(200, Product, "Product fetched successfully", "Success")
    );
    }
    else{
        return res
          .status(404)
          .json(
            new ApiResponse(404, "", "No product found", "Action Failed")
    ); 
    }
  });

/*
    Function Name - getAllProducts
    Functionality - Get All Products with Pagination
*/

  const getAllProducts = asyncHandler(async (req, res) => {
    let status= req.query?.status;
    let productType = req.query?.productType;
    let search = req.query?.search;
    let pagination = req.query?.pagination;
    const matchConditions = {};

    if (status) {
      matchConditions.status = status;
    }
    if (productType) {
      matchConditions.productType = productType;
    }
    if (search) {
      matchConditions.$or = [
        { barcode: { $regex: search, $options: "i" } }, 
        { itemName: { $regex: search, $options: "i" } },
        { aliasName: { $regex: search, $options: "i" } }
      ];
    }
    //pagination
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    
    const options = {
      page: page,
      limit: limit
    };

    const pipeline = [{ $match: matchConditions }];
    let product = await MasterProduct.aggregatePaginate(MasterProduct.aggregate(pipeline), options);

    if(pagination == "false"){
      product = await MasterProduct.find({
        status: "active"
      })
    }

    if(product){
        return res
          .status(200)
          .json(
            new ApiResponse(200, product, "Products fetched successfully", "Success")
    );
    }
    else{
        return res
          .status(500)
          .json(
            new ApiResponse(500, "", "Something went wrong", "Action Failed")
    ); 
    }
  });

  /*
    Function Name - getAllProducts
    Functionality - Get All Products with Pagination
  */

  const deleteProductbyID = asyncHandler(async (req, res) => {
      const id = req.query.id;
      const deletedProduct = await MasterProduct.findByIdAndDelete(id);
      if(deletedProduct){
        return res.status(200).json(new ApiResponse(200, deletedProduct, "Product deleted successfully", "Success"));
      } else{
        return res.status(404).json(new ApiResponse(404, "", "Something went wrong", "Action Failed"));
      }
  });

export { addProduct, editProduct, getProductbyID, getAllProducts, deleteProductbyID };

