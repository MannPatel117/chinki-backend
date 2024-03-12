import { asyncHandler } from "../utils/asyncHandler.js";
import { Account } from "../models/accounts.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

  const addAccount = asyncHandler(async (req, res) => {
    const account = req.body;
    const {
      supplierID,
      accountName,
      aliasName,
      phone_Number,
      address,
      subGroup,
      underGroup,
      paymentTerm,
      gstNumber,
      balance,
      email
    } = req.body;
    let missingArray = [];
    for (const key in account) {
      if (account[key] === "" || account[key] === null) {
        missingArray.push(key);
      }
    }
    if (missingArray.length !== 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, missingArray, "SOME FIELDS ARE MISSING"));
    } else {
      const AccountExists = await Account.findOne({
          $or: [{ accountName }, { aliasName }, { supplierID }],
        });
      if (AccountExists) {
        return res
          .status(409)
          .json(new ApiResponse(409, AccountExists, "ACCOUNT ALREADY EXISTS"));
      } else {
        const accountCreated = await Account.create({
          supplierID,
          accountName,
          aliasName,
          phone_Number,
          address,
          subGroup,
          underGroup,
          paymentTerm,
          gstNumber,
          balance,
          email
        });
        if (accountCreated) {
          return res
            .status(201)
            .json(
              new ApiResponse(201, accountCreated, "ACCOUNT SUCCESSFULLY CREATED")
            );
        } else {
          return res
            .status(409)
            .json(
              new ApiResponse(
                409,
                "Could not add account, please try again later",
                "FAILED TO ADD ACCOUNT"
              )
            );
        }
      }
    }
  });

  const editAccount = asyncHandler(async (req, res) => {
    const accountReq = req.body;
    let id= accountReq?._id;
    delete accountReq._id;
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      {
          $set: accountReq
      },
      {
          new: true
      }
    )
    return res
          .status(200)
          .json(
            new ApiResponse(200, updatedAccount, "ACCOUNT SUCCESSFULLY UPDATED")
          );
  });

  const getAccountbyID = asyncHandler(async (req, res) => {
      let id= req.body?._id;
      const accountFound = await Account.findById(
        id
      )
      if(accountFound){
          return res
            .status(200)
            .json(
              new ApiResponse(200, accountFound, "ACCOUNT FOUND")
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
  const getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find();
    if(accounts){
        return res
          .status(200)
          .json(
            new ApiResponse(200, accounts, "ACCOUNTS FOUND")
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

  const deleteAccountbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const deleteAccount = await Account.findByIdAndDelete(
      id
    )
    if(deleteAccount){
        return res
          .status(200)
          .json(
            new ApiResponse(200, "Account successfully deleted", "ACCOUNT DELETED")
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

export { addAccount, editAccount, getAccountbyID, getAllAccounts, deleteAccountbyID };

