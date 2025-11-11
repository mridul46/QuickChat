# 💬 QuickChat — Real-Time Chat Application

> A full-stack, real-time messaging web app built with **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB**, deployed on **Vercel** (frontend) and **Render** (backend).

---

## 🚀 Live Demo

- **Frontend (Vercel):** [https://quick-chat-red-rho.vercel.app](https://quick-chat-red-rho.vercel.app)  
- **Backend (Render):** [https://quickchat-backend-uw1b.onrender.com](https://quickchat-backend-uw1b.onrender.com)

---

## 🧠 Overview

**QuickChat** enables users to exchange messages instantly over the internet.  
It supports:
- Secure user authentication with JWT
- Live online/offline status tracking
- Persistent message history via MongoDB
- Real-time WebSocket communication using Socket.IO
- Cloud-hosted, scalable architecture

---

## ✨ Features

| Feature | Description |
|----------|-------------|
| 🔐 **Authentication** | JWT-based login, signup, and logout |
| 👤 **User Profiles** | Cloudinary image uploads and profile updates |
| ⚡ **Real-Time Chat** | Instant messaging powered by Socket.IO |
| 🟢 **Online Status** | Tracks active users dynamically |
| 💾 **Persistent Storage** | Messages stored securely in MongoDB Atlas |
| 📱 **Responsive UI** | Built with React + TailwindCSS |
| 🔔 **Toast Notifications** | Instant feedback via React-Hot-Toast |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite) + TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Realtime** | Socket.IO |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT |
| **Image Hosting** | Cloudinary |
| **Hosting** | Vercel (client) + Render (server) |

---

## 🏗️ Architecture

Frontend (Vercel)
↓
HTTP (REST API)
↓
Backend (Render / Express)
↓
WebSocket (Socket.IO)
↓
MongoDB Atlas (Database)
↓
Cloudinary (Media Storage)


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mridul46/QuickChat.git
cd QuickChat
2️⃣ Install dependencies
For backend
cd server
npm install
```
For frontend
```cd ../client
npm install
```
3️⃣ Environment Variables
```
Create a .env file in both server/ and client/ directories.
```
Server .env
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
```
Client .env
```
VITE_BACKEND_URL=https://quickchat-backend-uw1b.onrender.com
```
4️⃣ Run locally
Backend:
```
cd server
npm start
```
Frontend:
```
cd ../client
npm run dev
```

Then open ```http://localhost:5173```


🌐 API Endpoints
```
Method	    Endpoint             	Description
POST	    /api/v1/auth/register	      Register new user
POST	    /api/v1/auth/login	        Login user
GET     	/api/v1/auth/check	        Verify JWT token
PUT	     /api/v1/auth/update-profile	Update profile
POST	  /api/v1/messages/send/:id  	Send a message
GET	   /api/v1/messages/:id	       Fetch chat history
GET	    /api/v1/status	           Health check
```
🧩 Folder Structure
```
QuickChat/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```
📈 Future Enhancements

💬 Group Chat functionality

📎 File and image sharing

🕓 Typing indicators & read receipts

🔔 Push notifications

🌙 Dark mode

🔐 End-to-end encryption

🎥 Voice/Video calls (WebRTC)
