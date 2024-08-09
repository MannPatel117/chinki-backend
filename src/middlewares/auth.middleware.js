import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try { 
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json(
                new ApiResponse(401, "No Token Found", "TOKEN ERROR")
            )
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await Admin.findById(decodedToken?._id).select("-password")
        if (!user) {
            return res.status(401).json(
                new ApiResponse(401, "Invalid Access Token", "TOKEN ERROR")
            )
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json(
            new ApiResponse(401, error, "TOKEN ERROR")
        )
    }  
})