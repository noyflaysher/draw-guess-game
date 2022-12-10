import io from "socket.io-client";
let socket=null;

export const SocketService={
    init,
    terminate,
    on,
    emit, 
};

function init(){
    socket=io("https://warm-cliffs-51873.herokuapp.com/");
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

