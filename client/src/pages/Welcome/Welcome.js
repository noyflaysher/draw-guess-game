import React from 'react';
import "./Welcome.css";
import Login from '../../components/Login/Login';

function Welcome() {
  return (
    <div className='welcome'>
        <h1 className='welcome__title'>DRAW & GUESS</h1>
        <Login/>
    </div>
  )
}

export default Welcome