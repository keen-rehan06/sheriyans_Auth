import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
} from "../config/tokens.config.js";
import { verifyEmail } from "../email/verifyEmail.js";
import sessionModel from "../models/session. model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    const token = generateToken(user);
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    const newCreatedUser = await userModel
      .findById(user._id)
      .select("-password -token");
    res.cookie("token", token);
    console.log(user);
    res.status(201).send({
      message: "user created successfully!",
      success: true,
      data: newCreatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("User Creation Failed", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const hideSomeUserFields = await userModel
      .findById(user._id)
      .select("-password");
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res
        .status(401)
        .send({ message: "password is incorrect.", success: false });
    const session = await sessionModel.findOne({ userId: user._id });
    if (session) {
      await sessionModel.deleteOne({ userId: user._id });
    }
    const refreshToken = generateRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken,10);
    await sessionModel.create({
      userId: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = generateAccessToken(user);
    user.isLoggedIn = true;
    user.token = null;
    user.refreshToken = refreshToken;
    await user.save();
    res.clearCookie("token");
    return res
      .status(200)
      .cookie("refreshToken", refreshToken)
      .cookie("accessToken", accessToken)
      .send({
        message: `Welcome Back ${user.name}!`,
        success: true,
        data: hideSomeUserFields,
        accessToken,
      });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: "Login Failed", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: "Refresh Token is required!",
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PASS);

    // Find user
    const user = await userModel.findById(decoded.userid);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).send({
      success: true,
      message: "Access Token regenerated successfully!",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired refresh token!",
    });
  }
};

export const logOutUser = async (req, res) => {
  try{
    
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Failed to Logout!",
      success: false,
      error: error.message,
    });
  }
};


