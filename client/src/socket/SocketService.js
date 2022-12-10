import io from "socket.io-client";
let socket=null;
const url=encodeURI("https://draw-and-back-server.herokuapp.com/");

export const SocketService={
    init,
    terminate,
    on,
    emit, 
};

function init(){
    socket=io(url);
}

function terminate(){
    socket=null;
}

function on(event,func){
    socket.on(event,func);
}

function emit(event,func){
    socket.emit(event,func);
}

