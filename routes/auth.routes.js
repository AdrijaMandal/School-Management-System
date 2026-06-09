import express from "express";
import { loginUser, logoutUser, forgetPassword, resetPassword, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me",protect,getMe);

export default router;