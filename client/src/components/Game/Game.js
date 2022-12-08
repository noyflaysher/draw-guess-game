import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DrawingView from "../../pages/DrawingView/DrawingView";
import GuessingView from "../../pages/GuessingView/GuessingView";
import WaitingView from "../../pages//WaitingView/WaitingView";
import { SocketService } from '../../socket/SocketService';
import "./Game.css";
import Button from '@mui/material/Button';
{/* <Button variant="text">Text</Button> */}


function Game() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(0);
  const [newScores, setNewScoress] = useState();
  // const [waitForPlayer, setWaitForPlayer] = useState(true);
  const [choosenWord, setChoosenWord] = useState(null);
  const [draw, setDraw] = useState(false);
  const [waitForDraw, setWaitForDraw] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [waitForGuess, setWaitForGuess] = useState(false);
  const [drawingImg, setDrawingImg] = useState(null);
  const [isguessTrue, setIsguessTrue] = useState(false);

  useEffect(() => {
    SocketService.on("waitForPlayer", () => {
      console.log("waiting");
      setWaitForDraw(false);
      setWaitForGuess(false);
      setDraw(true);
    });

    SocketService.on("startGame", () => {
      console.log("start");
      setIsLoading(false);
    });

    SocketService.on("changeWaitForDraw", () => {
      setWaitForDraw(true);
      setWaitForGuess(false);
      setDraw(false);
    });

    SocketService.on("getWords", ({ word, points }) => {
      setChoosenWord(word);
      setNewScoress(scores);
    });

    SocketService.on("getDrawing", (drawingVideo) => {
      setDrawingImg(drawingImg);
      setDraw(false);
      setWaitForGuess(false);
      setWaitForDraw(false);
      setIsLoading(false);
    });

    SocketService.on("winner", (winner) => {
      setDraw(true);
      setWaitForDraw(false);
      setIsLoading(true);
      alert(`${winner} is the winner 🏆 `);
      localStorage.removeItem("players");
      SocketService.terminate()
      navigate("/");
    });
  }, []);

  const sendDrawImg=(drawingImg)=>{
    setWaitForGuess(true);
    SocketService.emit("sentDrawing",drawingImg);
  };

  const guessTrue=(guessWord)=>{
    if(guessWord.toLowerCase()===choosenWord){
        setIsguessTrue(true);
        setScores(scores+newScores);
    }else{
        alert("try again..")
    }
  };

  const changePlayer=()=>{
    setIsguessTrue(false);
    setDraw(!draw);
    setWaitForDraw(!waitForDraw);
    setWaitForGuess(false);
    SocketService.emit("success",scores);
  };

  const chooseWord=(word,scores)=>{
    SocketService.emit("sentWordChoosing",{ word, scores });
  };

  const endGame = () => {
    console.log("finish the game");
    SocketService.emit("endGame");
  };
  

  return (
    <div className="gameScreen">
        {isLoading && <WaitingView/>}
        {!isLoading && (
            <div className="gameScreen__header">
                <div className="gameScreen__header-scores">
                    scores : {scores}
                </div>
                {/* <Button className='gameScreen__header-btn' size="large" variant="outlined">Outlined</Button> */}
                <button className="gameScreen__header-btn" onClick={endGame}>finish the game</button>
            </div>
        )}
        {draw && !isLoading && (
        <DrawingView
          chooseWord={chooseWord}
          onClick={sendDrawImg}
          waiting={waitForGuess}
        />
      )}
      {!draw && !isLoading && (
        <GuessingView
            wait={waitForDraw}
          drawingImg={drawingImg}
          success={guessTrue}
        />
      )}
      {isguessTrue && (
        <div className="succes__popup">
          <h3>Your guess is true!</h3>
          <h4>you earn {newScores} points</h4>
          <button
            className="success__popup-close"
            onClick={() => {
                changePlayer();
            }}
          >
            X
          </button>
        </div>
      )}
        
    </div>
  )
}

export default Game
