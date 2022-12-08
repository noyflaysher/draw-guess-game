import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DrawingView from "../../pages/DrawingView/DrawingView";
import GuessingView from "../../pages/GuessingView/GuessingView";
import WaitingView from "../../pages//WaitingView/WaitingView";
import { SocketService } from '../../socket/SocketService';
import CloseIcon from '@mui/icons-material/Close';
import "./Game.css";


function Game() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(0);
  const [newScores, setNewScores] = useState();
  // const [waitForPlayer, setWaitForPlayer] = useState(true);
  const [word, setWord] = useState(null);
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

    SocketService.on("getWordChoosing", ({ word, scores }) => {
      console.log(`get word choosing`);
      setWord(word);
      setNewScores(scores);
    });

    SocketService.on("getDrawing", (drawingImg) => {
      console.log("get drawing");
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
      if(winner=="both"){
        alert(`both are the winner 🏆 `);
      }
      else{
        alert(`you are the winner 🏆 `);
      }      
      localStorage.removeItem("players");
      SocketService.terminate()
      navigate("/");
    });

    SocketService.on("loss", (loser) => {
      setDraw(true);
      setWaitForDraw(false);
      setIsLoading(true);
      alert(`you lost 😕 `);
      localStorage.removeItem("players");
      SocketService.terminate()
      navigate("/");
    });
  }, []);

  const sendDrawImg=(drawingImg)=>{
    setWaitForGuess(true);
    console.log("drawing send");
    SocketService.emit("sentDrawing",drawingImg);
  };

  const guessTrue=(guessWord)=>{
    if (guessWord.value == word) {
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
    console.log("send the word to server");
    SocketService.emit("sentWordChoosing",{ word, scores });
  };

  const endGame = () => {
    console.log("finish the game");
    SocketService.emit("endGame");
  };
  

  return (
    <div className="gameScreen">
        {isLoading && <WaitingView title="waiting for the other player"/>}
        {!isLoading && (
            <div className="gameScreen__header">
                <div className="gameScreen__header-scores">
                    scores : {scores}
                </div>
                <button className="gameScreen__header-btn" onClick={endGame}>end game</button>
            </div>
        )}
        {draw && !isLoading && (
        <DrawingView
          onchooseWord={chooseWord}
          onSend={sendDrawImg}
          waiting={waitForGuess}
        />
      )}
      {!draw && !isLoading && (
        <GuessingView
          waiting={waitForDraw}
          drawingImg={drawingImg}
          success={guessTrue}
        />
      )}
      {isguessTrue && (
        <div className="succes__popup">
          <button
            className="success__popup-close"
            onClick={()=>{
              changePlayer();
            }}
          >
           <CloseIcon/>
          </button>
          <h3>Your guess is true 🎉</h3>
          <h4>you earn {newScores} points</h4>
          
        </div>
      )}
        
    </div>
  )
}

export default Game
