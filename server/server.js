const dotenv = require("dotenv").config();
const express = require("express");

const DocumentRoutes = require("./Router/DocumentRouter");
const UserRoutes = require("./Router/userRouter");
const { findOrCreateDocument } = require("./config/config");
const Document = require("./models/documentModel");

const connectDB = require("./DB/db");
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running successfully");
});

app.use("/fetchAllDocuments", DocumentRoutes);
app.use("/userRoutes", UserRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, console.log(`server started on ${PORT}`));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("get-document", async (documentId) => {
    const userDocument = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", userDocument.data);

    socket.on("send-changes", (delta) => {
      // console.log(delta);

      //on our current socket, we want to broadcast a message to everyone else except for us that there some changes that they should receive, and the changes are--delta
      // socket.broadcast.emit("receive-changes", delta);

      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected!");
  // });
});
