import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck=asyncHandler(async(req,res)=>{
   return res.status(200).json({
    success:true,
    message: "server is Running..." 
   })
});
export{healthCheck}