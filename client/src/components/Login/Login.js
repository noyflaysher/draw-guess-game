import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketService } from "../../socket/SocketService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const playerName = useRef({ value: "" });

  const loginHandler = () => {
    let name = playerName.current.value;
    if (name) {
      SocketService.init();
      SocketService.emit("userLogIn", name);
      navigate("/game");
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="login">
      <input
        className="login__userName"
        type="text"
        placeholder="user name"
        ref={playerName}
      />
      <button className="login__button" onClick={loginHandler}>
        Log In
      </button>
    </div>
  );
}

export default Login;
