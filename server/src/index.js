const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = process.env.PORT || 3002;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let sockets = [];
let players = [];
let scores = [0, 0];
let player = true;

io.on("connection", (socket) => {
  sockets.push(socket);
  socket.on("userLogIn", (userName) => {
    players.push(userName);
    if (players.length === 1) {
      socket.emit("waitForPlayer");
    }
    if (players.length === 2) {
      socket.emit("startGame");
    }
    if (players.length > 2) {
      return;
    }

    socket.on("sendChoosingWord", ({ word, scores }) => {
      socket.broadcast.emit("getChoosingWord", { word, scores });
    });

    socket.on("sendDraw", (drawingImg) => {
      socket.broadcast.emit("getDraw", drawingImg);
    });

    socket.on("success", (points) => {
      scores[Number(player)] = points;
      player = !player;
    });

    socket.on("disconnect", () => {
      players = [];
      sockets = [];
    });

    socket.on("endGame", () => {
      let win = "";
      if (scores[0] === scores[1]) win = "both";
      if (scores[0] > scores[1]) win = players[0];
      if (scores[0] < scores[1]) win = players[1];
      scores[0] = 0;
      scores[1] = 0;
      socket.emit("winner", win);
      sockets.forEach((s) => s.disconnect());
    });
  });
});

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
