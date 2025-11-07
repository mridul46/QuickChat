
import Message from "../models/Message.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io, userSocketMap } from "../../server.js";
import User from "../models/User.models.js";

//Get all users except the logged in user
const getUsersForSidebar= asyncHandler(async(req,res)=>{
     const userId= req.user._id
     const filteredUsers= await User.find({
        _id:{$ne:userId}
     }).select("-password")

     //Count number of message not seen
     const unseenMessage={}
     const promises=filteredUsers.map(async(user)=>{
        const message=await Message.find({
            senderId:user._id,
            recieverId:userId,
            seen:false
        })
        if(message.length>0){
            unseenMessage[user._id]= message.length
        }
        await Promise.all(promises)

        res.json({
            success:true,
            users:filteredUsers,
            unseenMessage
        })
     })
})

//Get all message for selectedUsers

const getMessages= asyncHandler(async(req,res)=>{
    const {id:selectedUserId}= req.params;
    const myId= req.user._id;

    const messages=await Message.find({
        $or:[
            {senderId:myId,recieverId:selectedUserId},
            {senderId:selectedUserId,recieverId:myId},
        ]
    })
    await Message.updateMany({senderId:selectedUserId,recieverId:myId},
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

const sendMessage= asyncHandler(async(req,res)=>{
    const {text}=req.body;
     const image = req.file?.path || null; 
      let imageUrl;
     if (image) {
           const uploadResponse = await cloudinary.uploader.upload(image, {
             folder: "Gallery",
             resource_type: "image",
           });
          imageUrl = uploadResponse.secure_url;
         }
    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image:imageUrl
    } );
    //Emit the new Message to the reciever's socket
    const recieverSocketId= userSocketMap[recieverId]
    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessage)
    }
    res.json({
        success:true,
        newMessage
    })
})
export {
    getUsersForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage,
}