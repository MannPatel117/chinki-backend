import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

  const addUser = asyncHandler(async (req, res) => {
    const account = req.body;
    const {
      name,
      phone_Number,
      address,
      rewardPoint,
      rewardPointsHistory,
      totalTransaction
    } = req.body;
    
    if (phone_Number == 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, phone_Number, "PHONE NUMBER IS MISSING"));
    } else {
      const UserExists = await User.findOne({
          phone_Number,
        });
      if (UserExists) {
        return res
          .status(409)
          .json(new ApiResponse(409, UserExists, "User ALREADY EXISTS"));
      } else {
        const userCreated = await User.create({
          name,
          phone_Number,
          address,
          rewardPoint,
          rewardPointsHistory,
          totalTransaction
        });
        if (userCreated) {
          return res
            .status(201)
            .json(
              new ApiResponse(201, userCreated, "USER SUCCESSFULLY CREATED")
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

  const editUser = asyncHandler(async (req, res) => {
    const userReq = req.body;
    let id= userReq?._id;
    delete userReq._id;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
          $set: userReq
      },
      {
          new: true
      }
    )
    return res
          .status(200)
          .json(
            new ApiResponse(200, updatedUser, "USER SUCCESSFULLY UPDATED")
          );
  });

  const getUserbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const UserFound = await User.findById(
      id
    )
    if(UserFound){
        return res
          .status(200)
          .json(
            new ApiResponse(200, UserFound, "USER FOUND")
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

  const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if(users){
        return res
          .status(200)
          .json(
            new ApiResponse(200, users, "USER FOUND")
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

  const getUserbyNumber = asyncHandler(async (req, res) => {
    let userNumber= req.query.phone_Number;
    const users = await User.find({phone_Number: userNumber});
    if(users){
        return res
          .status(200)
          .json(
            new ApiResponse(200, users, "USER FOUND")
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

  const deleteUserbyID = asyncHandler(async (req, res) => {
    let id= req.body?._id;
    const deleteUser = await User.findByIdAndDelete(
      id
    )
    if(deleteUser){
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

  export { addUser, editUser, getUserbyID, getAllUsers, getUserbyNumber, deleteUserbyID };
