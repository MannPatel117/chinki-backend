import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

  /*
    Function Name - generateAccessToken
    Functionality - Creates token for Logged in user 
  */

  const model = new Admin();
  const generateAccessToken = async (userId) => {
    try {
      const accessToken = model.generateAccessToken(userId);
      return { accessToken };
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            "",
            "Something went wrong while generating token",
            "Token Error"
          )
        );
    }
  };

  /*
    Function Name - registerAdmin
    Functionality - Creates record for Admin Users
  */

  const registerAdmin = asyncHandler(async (req, res) => {
    const { 
      userName,
      password,
      location,
      role,
      status,
      key } = req.body;

    const existedUser = await Admin.findOne({
      userName
    });
    if (existedUser) {
      return res
        .status(409)
        .json(new ApiResponse(409, "", "User already exists", "Invalid Action"));
    } else{
      if (key === process.env.MANN_SECRET_PASSWORD) {
        const user = await Admin.create({
          userName,
          password,
          location,
          role,
          status
        });
        if (user) {
          return res
            .status(201)
            .json(new ApiResponse(201, user, "User created", "Success"));
        } else {
          return res
            .status(409)
            .json(
              new ApiResponse(409,"", "Could not generate user, please try again later", "Action failed")
            );
        }
      } else {
        return res
          .status(401)
          .json(
            new ApiResponse(401, "", "Unauthorized Access", "Unauthorized Acesss")
          );
      }
    }
  });

  /*
    Function Name - loginAdmin
    Functionality - Function to verify password and login user
  */

  const loginAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    const foundUser = await Admin.findOne({ userName });
    if (foundUser) {
      if(foundUser.status == "inactive"){
        return res.status(403)
        .json(new ApiResponse(403, "", "User is inactive", "Forbidden")
        );
      }else{
        if (foundUser.password == password) {
          const tokens = await generateAccessToken(foundUser._id);
          let User=foundUser.toObject();
          delete User.password;
          delete User.status;
          delete User.__v;
          User.accessToken = tokens.accessToken
          return res
            .status(200)
            .json(new ApiResponse(200, User, "User successfully logged in", "Success"));
        } else {
          return res
            .status(409)
            .json(
              new ApiResponse(409, "", "Password is incorrect", "Invalid Credentials")
            );
        }
      }
    } else {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409, "",
            "Username is incorrect, No User Found",
            "Invalid Credential"
          )
        );
    }
  });

  /*
    Function Name - patchAdmin
    Functionality - Function to fetch Admin 
  */

  const patchAdmin = asyncHandler(async (req, res) => {
    const patch = req.body;
    const id = req.query.id;
    const updatedUser = await Admin.findOneAndUpdate(
      { _id: id },
      { $set: patch },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully", "Success"));
  });

  /*
    Function Name - deleteAdmin
    Functionality - Function to delete Admin 
  */

  const deleteAdmin = asyncHandler(async (req, res) => {
      const id = req.query.id;
      const deletedUser = await Admin.findByIdAndDelete(id);
      if(deletedUser){
        return res.status(200).json(new ApiResponse(200, deletedUser, "User deleted successfully", "Success"));
      } else{
        return res.status(404).json(new ApiResponse(404, "", "Something went wrong", "Action Failed"));
      }
    });

  /*
    Function Name - getAllAdmin
    Functionality - Function to delete Admin 
  */

    const getAllAdmin = asyncHandler(async (req, res) => {
      const { page = 1, limit = 10 } = req.query;
      try {
        const aggregate = Admin.aggregate([
          {
            $project: {
              __v: 0,
              password: 0
            }
          }
        ]);
    
        // Apply pagination
        const options = {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
        };
    
        const users = await Admin.aggregatePaginate(aggregate, options);
    
        if (users.docs.length > 0) {
          return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully", "Success"));
        } else {
          return res.status(404).json(new ApiResponse(404, "", "No users found", "Action Failed"));
        }
      } catch (error) {
        return res.status(500).json(new ApiResponse(500, "", "Something went wrong", "Action Failed"));
      }   
    });

  /*
    Function Name - verifySession
    Functionality - Function to check Admin session validity
  */
  

  const verifySession = asyncHandler(async(req, res) => {
    try { 
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      if (decodedToken) {
          return res.status(200).json(
              new ApiResponse(200, "", "Success", "Success")
          )
      }
      req.user = user;
    } catch (error) {
      return res.status(201).json(
          new ApiResponse(201, error, "Failed Action", "Token Error")
      )
    }
  })

export { registerAdmin, loginAdmin, patchAdmin, deleteAdmin, getAllAdmin, verifySession };
