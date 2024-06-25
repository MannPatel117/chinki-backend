import { asyncHandler } from "../utils/asyncHandler.js";
import { AdminUser } from "../models/adminUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const model = new AdminUser();
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await AdminUser.findById(userId);
    const refreshToken = model.generateRefreshToken(userId);
    const accessToken = model.generateAccessToken(userId);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "Something went wrong while generating token",
          "TOKEN ERROR"
        )
      );
  }
};

const loginAdminUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (userName === "" || password === "") {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Username or password are missing",
          "INVALID CREDENTIALS"
        )
      );
  }
  const foundUser = await AdminUser.findOne({ userName });
  if (foundUser) {
    if (foundUser.password == password) {
      const tokens = await generateAccessAndRefreshTokens(foundUser._id);
      const options = {
        httpOnly: true,
        secure: true,
      };
      const currentUser = {
        userName: foundUser.userName,
        role: foundUser.role,
        location: foundUser.location,
        accessToken: tokens.accessToken,
        id: foundUser._id,
      };
      return res
        .status(200)
        .cookie("refreshToken", tokens.refreshToken, options)
        .json(new ApiResponse(200, currentUser, "User logged in"));
    } else {
      return res
        .status(409)
        .json(
          new ApiResponse(409, "Password is incorrect", "INVALID CREDENTIAL")
        );
    }
  } else {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          "Username is incorrect, No User Found",
          "INVALID CREDENTIAL"
        )
      );
  }
});

const registerAdminUser = asyncHandler(async (req, res) => {
  const { userName, password, location, role, key } = req.body;
  if (
    userName === "" ||
    password === "" ||
    location === "" ||
    role === "" ||
    key === ""
  ) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Some fields are missing", "INVALID CREDENTIALS")
      );
  }
  const existedUser = await AdminUser.findOne({
    userName,
  });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, "User already exists", "INVALID ACTION"));
  }
  if (key === process.env.MANN_SECRET_PASSWORD) {
    const user = await AdminUser.create({
      userName,
      password,
      location,
      role,
    });
    if (user) {
      const filterUser = AdminUser.findById(user._id).select(
        "-password -refreshToken"
      );
      return res
        .status(201)
        .json(new ApiResponse(200, filterUser, "User logged in"));
    } else {
      return res
        .status(409)
        .json(
          new ApiResponse(409, "Could not generate user, please try again later", "ACTION FAILED")
        );
    }
  } else {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Unauthorized access for creating user",
          "UNAUTHORIZED ACCESS"
        )
      );
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json(new ApiResponse(200, user, "User logged in"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
        .status(401)
        .json(
          new ApiResponse(401, "No Token Found", "UNAUTHORIZED REQUEST")
        );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await AdminUser.findById(decodedToken?._id);

    if (!user) {
    return res
        .status(401)
        .json(
          new ApiResponse(401, "Invalid refresh token", "UNAUTHORIZED REQUEST")
        );
    }

    if (incomingRefreshToken !== user?.refreshToken) {
    return res
        .status(401)
        .json(
          new ApiResponse(401, "Refresh token is expired or used", "TOKEN EXPIRED")
        );
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return res
        .status(401)
        .json(
          new ApiResponse(401, error?.message || "Invalid refresh token", "TOKEN EXPIRED")
        );
  }
});

const logoutUser = asyncHandler(async(req, res) => {
    await AdminUser.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "USER SUCCESSFULLY LOGGED OUT"))
})

const verifySession = asyncHandler(async(req, res) => {
  try { 
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decodedToken) {
        return res.status(200).json(
            new ApiResponse(200, "SUCCESS", "SUCCESS")
        )
    }
    req.user = user;
  } catch (error) {
    return res.status(201).json(
        new ApiResponse(201, error, "TOKEN ERROR")
    )
  }
})

export { loginAdminUser, registerAdminUser, getUser, refreshAccessToken, logoutUser, verifySession };
