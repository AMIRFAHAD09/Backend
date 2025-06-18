require('dotenv').config()
const express=require('express');
const cors = require("cors")
const connectDb = require('./util/db');
const authRouter = require('./Router/auth-router')
const chatRouter = require('./Router/chat-Router')
const messageRouter = require('./Router/message-Router')
const uploadRouter = require('./Router/upload-Router')
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
// app.get('/',(req,res) => {
//     res.status(200).send("this is chat msg");
// })

const app = express();
const server = http.createServer(app);

const corOptions = {
    origin:"http://localhost:5173",
    methods:["GET", "POST", "PATCH", "HEAD", "DELETE"],
    credentials:true
}
app.use(cors(corOptions))
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/upload',uploadRouter)
// 🔌 Setup Socket.IO server
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  

// 🧠 User mapping for direct messages
const socketUserMap = new Map();

// ✅ Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("🚫 No token in handshake");
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(user)
    socket.user = user; // Store user info on socket
    socketUserMap.set(user.id, socket.id); // Optional: map for DMs
    next();
  } catch (err) {
    console.error("🚫 Invalid token");
    next(new Error("Authentication error: Invalid token"));
  }
});

function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

  io.on("connection", (socket) => {
    console.log(`🟢 User connected:, ${socket.user.username} (${socket.id})`);
  
      // online notification
      socket.broadcast.emit("user_online", { userId: socket.user.id });
      
      socket.on("get_online_users", () => {
        const onlineUsers = Array.from(socketUserMap.keys());
        socket.emit("online_users", onlineUsers);
      });

      // Join private room
      socket.on("join_room", ({ otherUserId }) => {
      const roomId = getRoomId(socket.user.id, otherUserId);
      socket.join(roomId);
      console.log(`${socket.user.username} joined room ${roomId}`);
    });


    socket.on("send_message", ({ content, to }) => {
      const roomId = getRoomId(socket.user.id, to);
    
      const messageToSend = {
        from: socket.user.id,
        to,
        content,
        sender: socket.user.username,
        timestamp: new Date(),
      };
    
      // io.to(roomId).emit("receive_message", messageToSend);
      const receiverSocketId = socketUserMap.get(to);
      const senderSocketId = socket.id;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", messageToSend);  // ✅ only to receiver
      }
      io.to(senderSocketId).emit("receive_message", messageToSend);
    });
    

    
  // ✅ Typing indicator events
  socket.on("typing", ({ to }) => {
    const roomId = getRoomId(socket.user.id, to);
    socket.to(roomId).emit("typing", { from: socket.user.id });
  });

  socket.on("stop Typing", ({ to }) => {
    const roomId = getRoomId(socket.user.id, to);
    socket.to(roomId).emit("stop Typing", { from: socket.user.id });
  });

    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.user.username}`);
        socket.broadcast.emit("user_offline", { userId: socket.user.id });

      });
    });
    
  app.get("/", (req, res) => {
      res.send("✅ Server is working!");
    });
const PORT = process.env.PORT_NO || 5000;
connectDb().then(()=>{
    server.listen(PORT,()=>{
        console.log(`server is running at port [${PORT}]`)
    })
})

