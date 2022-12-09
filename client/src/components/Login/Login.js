import React, { useRef, useState } from 'react';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { SocketService } from '../../socket/SocketService';

function Login() {
    const navigate=useNavigate();
    const playerName=useRef({ value: "" });
    // localStorage.removeItem("players");

    const loginHandler=()=>{
        let name=playerName.current.value;
        if(name){
            const players=JSON.parse(localStorage.getItem("players"))||[];
            players.push({name});
            SocketService.init();
            SocketService.emit("userLogIn",name);
            // localStorage.setItem("players",JSON.stringify(players));
            navigate("/game");
        }else{
            alert("Please enter your name");
        }
    }

    

  return (
    <div className='login'>
        <input className='login__userName' type="text" placeholder='user name' ref={playerName}/>
        <button className='login__button' onClick={loginHandler}>Log In</button>
    </div>
  )
}

export default Login