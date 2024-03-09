const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
dotenv.config();
connectDB();
const app = express();

app.use(express.json());



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running Successfully");
  });
}

// --------------------------deployment------------------------------


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, console.log("server started in port 5000"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://letsdiscuss.onrender.com/",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  //socket named setup is created below which takes users data
  //every individual will have a seperate room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing",(room)=>socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      //the above line means that the message should not be reflected to the person who is sending the message

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
});
