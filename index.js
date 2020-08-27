const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const { addUser, removeUser, getUser, getUsers } = require("./users");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    return response.status(200).json({});
  }
  next();
});

io.on("connection", (socket) => {
  console.log("New Connection Created..");
  socket.on("join", ({ name, room }) => {
    const user = addUser(socket.id, name, room);

    socket.emit("message", {
      user: "admin",
      text: `wellcome ${user.name} to ${user.room} room.`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joind.` });
    socket.join(user.room);
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user.room)
      io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user)
      socket.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room.`,
      });
  });
});

server.listen(port, () => console.log(`Server is listening on port ${port}`));
