import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../models/User.models.js';


export const protectRoute= asyncHandler(async(req,res,next)=>{
   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decode= jwt.verify(token,process.env.JWT_SECRET)
    const user= await User.findById(decode.userId).select("-password")
    if(!user){
        return res.json(
            {
                success:true,
                message:"User not found "
            }
        )
    };
    req.user=user
    next()
})

