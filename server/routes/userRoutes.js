import express from "express";
import multer from "multer";
import { 
  getUserData, 
  addTransaction, 
  updateProfile, 
  changePassword, 
  requestPhoneVerification, 
  verifyPhone,
  uploadAvatar
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

userRouter.get("/data", authMiddleware, getUserData);
userRouter.post("/transactions", authMiddleware, addTransaction);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.post("/change-password", authMiddleware, changePassword);
userRouter.post("/request-phone-verification", authMiddleware, requestPhoneVerification);
userRouter.post("/verify-phone", authMiddleware, verifyPhone);
// Avatar upload with error handling
userRouter.post("/upload-avatar", authMiddleware, (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            success: false, 
            message: "File size too large. Maximum size is 5MB" 
          });
        }
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    next();
  });
}, uploadAvatar);

export default userRouter;
