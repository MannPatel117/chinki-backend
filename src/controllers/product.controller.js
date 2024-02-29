import { asyncHandler } from "../utils/asyncHandler.js";
import { MasterProduct } from "../models/masterProduct.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addProduct = asyncHandler(async (req, res) => {
  const product = req.body;
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
    hsnCode,
    status,
  } = req.body;
  let missingArray = [];
  for (const key in product) {
    if (product[key] === "" || product[key] === null) {
      missingArray.push(key);
    }
  }
  if (missingArray.length !== 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, missingArray, "SOME FIELDS ARE MISSING"));
  } else {
    const productExists = await MasterProduct.findOne({
      $or: [{ itemName }, { aliasName }, { barcode }],
    });
    if (productExists) {
      return res
        .status(409)
        .json(new ApiResponse(409, productExists, "PRODUCT ALREADY EXISTS"));
    } else {
      const productCreated = await MasterProduct.create({
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
        hsnCode,
        status,
      });
      if (productCreated) {
        return res
          .status(201)
          .json(
            new ApiResponse(201, productCreated, "PRODUCT SUCCESSFULLY CREATED")
          );
      } else {
        return res
          .status(409)
          .json(
            new ApiResponse(
              409,
              "Could not add product, please try again later",
              "FAILED TO ADD PRODUCT"
            )
          );
      }
    }
  }
});

const editProduct = asyncHandler(async (req, res) => {
  const product = req.body;
  let id= product?._id;
  delete product._id;
  const updatedProduct = await MasterProduct.findByIdAndUpdate(
    id,
    {
        $set: product
    },
    {
        new: true
    }
  )
  return res
        .status(200)
        .json(
          new ApiResponse(200, updatedProduct, "PRODUCT SUCCESSFULLY UPDATED")
        );
});

const getProductbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const Product = await MasterProduct.findById(
      id
    )
    if(Product){
        return res
          .status(200)
          .json(
            new ApiResponse(200, Product, "PRODUCT FOUND")
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
  const getAllProducts = asyncHandler(async (req, res) => {
    const activeProduct = await MasterProduct.find({ status: 'ACTIVE' });
    if(activeProduct){
        return res
          .status(200)
          .json(
            new ApiResponse(200, activeProduct, "PRODUCTS FOUND")
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

  const deleteProductbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const Product = await MasterProduct.findByIdAndDelete(
      id
    )
    if(Product){
        return res
          .status(200)
          .json(
            new ApiResponse(200, "Product successfully deleted", "PRODUCT DELETED")
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

export { addProduct, editProduct, getProductbyID, getAllProducts, deleteProductbyID };

