import User from "../models/User.models.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../config/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
// ..............user registration..........................
const signup= asyncHandler(async(req,res)=>{
    const {fullName,email,password,bio} =req.body 
    if(!fullName){
        return res.json({
            success:false,
            message:"Full Name is required"
        })
    }
    if(!email){
        return res.json({
            success:false,
            message:"Email is required "
        })
    }
    if(!password){
        return res.json({
            success:false,
            message:"password is required "
        })
    }

    const user= await User.findOne({email})
    if(user){
        return res.json({
            success:false,
            message:"Account is already existed "
        })
    }

    const salt= await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt)
    
    const newUser= await User.create({
        fullName,
        email,
        password:hashedPassword,
        bio,
    });

    const token=generateToken(newUser._id)
    return res.status(201).
    json({
        success:true,
         userData:newUser,
         token,
         message:"Account created successfully"
    })
});

// ...................user login...................
const  login= asyncHandler(async(req,res)=>{
  const {email,password} =req.body 
  const userData= await User.findOne({email})
  const isPasswordcorrect= await bcrypt.compare(password,userData.password)
  if(!isPasswordcorrect){
    return res.json({
            success:false,
            message:" Password is incorrect"
        })
  }
  const token=generateToken(userData._id)
    return res.status(201).
    json({
        success:true,
         userData,
         token,
         message:"Account login successfully"
    })

})
//controller to check if user is authentic
 const checkAuth=(req,res)=>{
    res.json({
        success:true,
        user:req.user
    })
}


const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please log in again.",
    });
  }

  const userId = req.user._id;
  const { bio, fullName } = req.body;
  const profilePic = req.file?.path || null; 

  let updatedFields = {};
  if (bio) updatedFields.bio = bio;
  if (fullName) updatedFields.fullName = fullName;

  try {
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "user_profiles",
        resource_type: "image",
      });
      updatedFields.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
});


const logout = asyncHandler(async (req, res) => {

  return res.status(200).json({
    success: true,
    message: "User logged out successfully. Please remove the token from client storage."
  });
});
export{
   signup,
    login,
    checkAuth,
    updateProfile,
     logout,
}


