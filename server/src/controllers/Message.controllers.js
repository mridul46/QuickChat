
import Message from "../models/Message.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io, userSocketMap } from "../../server.js";
import User from "../models/User.models.js";
import cloudinary from "../config/cloudinary.js";

//Get all users except the logged in user
const getUsersForSidebar= asyncHandler(async(req,res)=>{
     const userId= req.user._id
     const filteredUsers= await User.find({
        _id:{$ne:userId}
     }).select("-password")

     //Count number of message not seen
     const unseenMessages={}
     const promises=filteredUsers.map(async(user)=>{
        const message=await Message.find({
            senderId:user._id,
            receiverId:userId,
            seen:false
        })
        if(message.length>0){
            unseenMessages[user._id]= message.length
        }
        
     })
     await Promise.all(promises)

        res.json({
            success:true,
            users:filteredUsers,
            unseenMessages
        })
})

//Get all message for selectedUsers

const getMessages= asyncHandler(async(req,res)=>{
    const {id:selectedUserId}= req.params;
    const myId= req.user._id;

    const messages=await Message.find({
        $or:[
            {senderId:myId,receiverId:selectedUserId},
            {senderId:selectedUserId,receiverId:myId},
        ]
    })
    await Message.updateMany({senderId:selectedUserId,receiverId:myId},
        {seen:true}
    );
    res.json({
        success:true,
        messages
    })
})
 

//api to mark message as seen using message id
const markMessageAsSeen= asyncHandler(async(req,res)=>{
    const {id}= req.params
    await Message.findByIdAndUpdate(
        id,
        {seen:true},
    )
    res.json({success:true})
})

//send message to selectedUser

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { text, image } = req.body;  // ✅ image now read from body, not req.file

  //console.log("📩 Incoming message request:", req.params, Object.keys(req.body));

  if (!receiverId) {
    return res.status(400).json({ success: false, message: "Receiver ID missing" });
  }

  let imageUrl = null;

  // ✅ Upload if the frontend sent a base64 image
  if (image && image.startsWith("data:image")) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "Gallery",
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error.message);
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }
  }

  // ✅ Save message to DB
  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  // ✅ Notify receiver in real time
  const receiverSocketId = userSocketMap[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({ success: true, newMessage });
});


export {
    getUsersForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage,
}