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

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
// app.use(cors(corsOptions));
// app.use(express.static("public"));

let scores=[0,0];
let players=[];
let sockets=[];
let bool=true;
let socket1;
let socket2;

io.on("connection", (socket) => {
  sockets.push(socket);

  socket.on("userLogIn", (userName) => {
    players.push(userName);
    if (players.length === 1) {
      socket.emit("waitForPlayer");
      // console.log(`player 1, socket id : ${socket.id}`);
      socket1=socket.id;
    }
    if (players.length === 2) {
      // console.log(`player 2, socket id : ${socket.id}`);
      socket2=socket.id
      io.emit("startGame");
    }
    if (players.length > 2) {
      return;
    }

    socket.on("sentDrawing", (drawingImg) => {
      socket.broadcast.emit("getDrawing", drawingImg);
    });

    socket.on("sentWordChoosing", ({ word, scores }) => {
      socket.broadcast.emit("getWordChoosing", { word, scores });
    });

    socket.on("success", (points) => {
      scores[Number(bool)] = points;
      bool = !bool;
      socket.broadcast.emit("changeWaitForDraw");
    });

    socket.on("disconnect", () => {
      players = [];
    });

    socket.on("endGame", () => {
      var win = "";
      if (scores[0] == scores[1]){
        win = "both";
        io.emit("winner", win);
        
      } 
      else if (scores[0] > scores[1]){
        win = "player 1";
        los="player2";
        io.to(socket1).emit("winner", win);
        io.to(socket2).emit("loss", los);
        
      } 
      else if (scores[0] < scores[1]) {
        win = "player 2";
        los="player1";
        io.to(socket2).emit("winner", win);
        io.to(socket1).emit("loss", los);
      }
      sockets.forEach((s) => s.disconnect());
    });
  });
});


server.listen(3002,()=>{
    console.log("SERVER IS RUNNING");
})