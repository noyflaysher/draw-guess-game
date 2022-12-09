const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let sockets=[];
let players=[];
let scores=[0,0];
let player=true;
// let socket1;
// let socket2;

io.on("connection", (socket) => {
  sockets.push(socket);

  socket.on("userLogIn", (userName) => {
    players.push(userName);
    if (players.length === 1) {
      socket.emit("waitForPlayer");
    }
    if (players.length === 2) {
      io.emit("startGame");
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
      console.log(scores);
      player = !player;
      socket.broadcast.emit("changeWaitForDraw");
    });

    socket.on("disconnect", () => {
      players = [];
    });

    socket.on("endGame", () => {
      let win = "";
      if (scores[0] == scores[1]) win = "both";
      if (scores[0] > scores[1]) win = "player 1";
      if (scores[0] < scores[1]) win = "player 2";
      io.emit("winner", win);
      sockets.forEach((s) => s.disconnect());
    });

    // socket.on("endGame", () => {
    //   let win = "";
    //   if (scores[0] == scores[1]){
    //     win = "both";
    //     io.emit("winner", win);
    //   } 
    //   if (scores[0] > scores[1]){
    //     win = "player 1";
    //     io.to(socket1).emit("winner",win);
    //     io.to(socket2).emit("loss");
    //   } 
    //   if (scores[0] < scores[1]){
    //     win = "player 2";
    //     io.to(socket2).emit("winner",win);
    //     io.to(socket1).emit("loss");
    //   } 
      
    //   sockets.forEach((s) => s.disconnect());
    // });
  });
});


server.listen(3002,()=>{
    console.log("SERVER IS RUNNING");
})