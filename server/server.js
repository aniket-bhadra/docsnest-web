const dotenv = require("dotenv").config();
const express = require("express");

const connectDB = require("./DB/db");
connectDB();

const app = express();
app.use(express.json());

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("get-document", (documentId) => {
    const data = "";
    socket.join(documentId);
    socket.emit("load-document", data);

    socket.on("send-changes", (delta) => {
      // console.log(delta);

      //on our current socket, we want to broadcast a message to everyone else except for us that there some changes that they should receive, and the changes are--delta
      // socket.broadcast.emit("receive-changes", delta);

      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected!");
  // });
});
