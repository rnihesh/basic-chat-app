const http = require("http");

const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messages = [];

const PORT = process.env.PORT || 9000;

//socket.io
io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  messages.forEach((msg) => {
    socket.emit("message", msg);
  });

  socket.on("user-message", (message) => {
    console.log("A new user message : ", message);

    messages.push(message);
    io.emit("message", message);
    console.log(messages);
  });

  socket.on("reset", () => {
    messages.length = 0;
    io.emit("reset");
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`));
