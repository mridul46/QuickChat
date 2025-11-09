import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import connectDB from './src/config/db.js'
import userRouter from './src/routes/user.routes.js'
import healthCheckRouter from './src/routes/healthCheck.routes.js'
import messageRouter from './src/routes/message.routes.js'
import { Server } from 'socket.io'
// Create Express app and http server
const app = express()
const server = http.createServer(app)


//Initialize socket.io server
export const io= new Server(server,{
    cors:{origin:"*"}
})


//store online Users
export const userSocketMap={};  //{userId:socketId}
//socket.io connection handler
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
   // console.log("User Connected",userId)

    if(userId){
        userSocketMap[userId]=socket.id
    }

    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
     //   console.log("User disconnected","userId")
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })   
})





// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: "https://quick-chat-bay-six.vercel.app/login",
  credentials: true,
}));


// Routes setup
app.use("/api/v1/healthcheck", healthCheckRouter); 
app.use("/api/v1/status", (req, res) => {
    res.send("Server is live");
});
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages",messageRouter)

// Connect MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !=="production"){
    server.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});
}
//export server for vercel
export default server ;
