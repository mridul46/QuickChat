import {Router} from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/User.controllers.js';
import { protectRoute } from '../middleware/auth.js';
import upload from '../utils/multer.js';

const userRouter=Router()

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);
userRouter.get("/check",protectRoute,checkAuth)
userRouter.get("/logout",protectRoute,logout)

export default  userRouter;