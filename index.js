const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("../server/route/UserRoute");
const messageRoute = require("../server/route/MessagesRoute");
const socket = require("socket.io");
// Place this at the top

const app = express();

// CORS options to allow requests from your frontend
const corsOptions = {
  origin: "*", // Allow requests from this origin
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);

// Mongoose connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose connected successfully"))
  .catch((error) => console.log(error));

// Server Connection
const server = app.listen(process.env.PORT, () => {
  console.log(`Server connected at http://localhost:${process.env.PORT}`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: "*", // Allow requests from this origin
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
