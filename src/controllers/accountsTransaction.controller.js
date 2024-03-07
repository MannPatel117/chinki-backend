import { asyncHandler } from "../utils/asyncHandler.js";
import { accountTransaction } from "../models/accountsTransaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addTransaction = asyncHandler(async (req, res) => {
  const offer = req.body;
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
  for (const key in offer) {
    if (offer[key] === "" || offer[key] === null) {
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

const editTransaction = asyncHandler(async (req, res) => {
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

const getTransactionbyID = asyncHandler(async (req, res) => {
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
  const getAllTransaction = asyncHandler(async (req, res) => {
    const accountsTransaction = await accountTransaction.find();
    if(accountsTransaction){
        return res
          .status(200)
          .json(
            new ApiResponse(200, accounts, "ACCOUNTS TRANSACTION FOUND")
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

export { addTransaction, editTransaction, getTransactionbyID, getAllTransaction, deleteTransactionbyID };

