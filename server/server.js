import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import connectDB from './src/config/db.js'
import userRouter from './src/routes/user.routes.js'
import healthCheckRouter from './src/routes/healthCheck.routes.js'

// Create Express app and http server
const app = express()
const server = http.createServer(app)

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/v1/healthcheck", healthCheckRouter); 
app.use("/api/v1/status", (req, res) => {
    res.send("Server is live");
});
app.use("/api/v1/auth", userRouter);

// Connect MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});
