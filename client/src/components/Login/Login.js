import React, { useRef, useState } from 'react';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { SocketService } from '../../socket/SocketService';

function Login() {
    const navigate=useNavigate();
    const playerName=useRef({ value: "" });
    localStorage.removeItem("players");
    const [enterName,setEnterName]=useState(true);

    const loginHandler=()=>{
        let name=playerName.current.value;
        console.log("log in");
        if(name){
            const players=JSON.parse(localStorage.getItem("players"))||[];
            players.push({name});
            SocketService.init();
            SocketService.emit("userLogIn",name);
            localStorage.setItem("players",JSON.stringify(players));
            console.log("navigate");
            navigate("/game");
        }else{
            alert("Please enter your name");
        }
    }

    

  return (
    <div className='login'>
        <input className='login__userName' type="text" placeholder='user name' ref={playerName}/>
        {/* <input className='login__room' type="text" placeholder='room number' ref={room}/> */}
        <button className='login__button' onClick={loginHandler}>Log In</button>
        {!enterName && <p>Please enter your name</p>}
    </div>
  )
}

export default Login