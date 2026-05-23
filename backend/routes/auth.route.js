import express from "express";
import * as authController from "../controllers/user.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register",authMiddleware.checkUserRegister,authController.registerUser,);
router.get("/get-me",authMiddleware.isUserLoggedIn);
router.post("/login",authController.loginUser);
router.get("/refresh-token",authController.refreshToken);

export default router;
    