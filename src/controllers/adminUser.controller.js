import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { AdminUser } from "../models/adminUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const loginAdminUser = asyncHandler(async (req, res) =>{
    const {userName, password } = req.body;
    if(userName === '' || password === ''){
        throw new ApiError(400, "Invalid Credentials")
    }
    const foundUser = await AdminUser.findOne({userName})
    if(foundUser){
        if(foundUser.password == password){
            const currentUser = {
                "userName": foundUser.userName,
                "role": foundUser.role,
                "location": foundUser.location
            }
            return res.status(201).json(
                new ApiResponse(200, currentUser, "User logged in")
            )
        }
        else{
            throw new ApiError(409, "Invalid Credentials")
        }
    }
    else{
        throw new ApiError(409, "User not found")
    }
})

const registerAdminUser = asyncHandler(async (req, res) =>{
    const {userName, password, location, role, key } = req.body;
    if(userName === '' || password === '' || location === '' || role === '' || key === ''){
        throw new ApiError(400, "Invalid Credentials")
    }
    const existedUser = await AdminUser.findOne({
        userName
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    if(key === process.env.MANN_SECRET_PASSWORD){
        const user = await AdminUser.create({
            userName,
            password,
            location,
            role
        })
    }
    else{
        throw new ApiError(400, "Unauthorized access")
    }
    if(user){
        const filterUser = AdminUser.findById(user._id).select("-password -refreshToken")
        return res.status(201).json(
                new ApiResponse(200, filterUser, "User logged in")
        )
    }
    else{
        throw new ApiError(409, "Username not found")
    }
})

export { loginAdminUser, registerAdminUser }