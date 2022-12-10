import io from "socket.io-client";
let socket=null;

export const SocketService={
    init,
    terminate,
    on,
    emit, 
};

function init(){
    socket=io("http://localhost:3002");
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

