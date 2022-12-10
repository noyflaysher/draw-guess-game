import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SocketService } from '../../socket/SocketService';
import DrawingView from "../../pages/DrawingView/DrawingView";
import GuessingView from "../../pages/GuessingView/GuessingView";
import WaitingView from "../../pages//WaitingView/WaitingView";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./Game.css";


function Game() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(0);
  const [newScores, setNewScores] = useState(0);
  const [word, setWord] = useState(null);
  const [draw, setDraw] = useState(false);
  const [waitForDraw, setWaitForDraw] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [waitForGuess, setWaitForGuess] = useState(false);
  const [drawingImg, setDrawingImg] = useState(null);
  const [isguessTrue, setIsguessTrue] = useState(false);
  const [winner, setWinner] = useState("");
  const [open,setOpen]=useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -150%)',
    width: 220,
    height:120,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 24,
    p: 4,
    fontSize:'large',
    fontSize:'30px',
    fontFamily:'monospace',
  };
  
  useEffect(() => {
    SocketService.on("waitForPlayer", () => {
      setWaitForDraw(false);
      setWaitForGuess(false);
      setDraw(true);
    });

    SocketService.on("startGame", () => {
      setIsLoading(false);
    });

    SocketService.on("changeWaitForDraw", () => {
      setWaitForDraw(true);
      setWaitForGuess(false);
      setDraw(false);
    });

    SocketService.on("getChoosingWord", ({ word, scores }) => {
      setWord(word);
      setNewScores(scores);
    });

    SocketService.on("getDraw", (drawingImg) => {
      setDraw(false);
      setDrawingImg(drawingImg);
      setWaitForGuess(false);
      setIsLoading(false);
      setWaitForDraw(false);
    });

    SocketService.on("winner", (winner) => {
      if(winner=="both"){
        setWinner("both are");
      }
      else{
        setWinner(`${winner} is`);
      } 
      setOpen(true);     
    });


  }, []);

  const chooseWord=(word,scores)=>{
    SocketService.emit("sendChoosingWord",{ word, scores });
  };

  const restartGame=()=>{
    setDraw(true);
    setWaitForDraw(false);
    setIsLoading(true);
    SocketService.terminate()
    navigate("/");
  }

  const sendDrawImg=(drawingImg)=>{
    setWaitForGuess(true);
    SocketService.emit("sendDraw",drawingImg);
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

  const endGame = () => {
    setIsguessTrue(false);
    SocketService.emit("endGame");
  };

  return (
    <div className="gameScreen">
        {isLoading ? <WaitingView title="waiting for the other player"/> :
        (
            <div className="gameScreen__header">
                <div className="gameScreen__header-scores">
                    scores : {scores}
                </div>
                <button className="gameScreen__header-btn" onClick={endGame}>end game</button>
            </div>
        )
        }
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

      <Modal
        open={isguessTrue}
        onClose={()=>changePlayer()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h4">
              <h3>Your guess is true 🎉</h3>
          </Typography>
          <Typography id="modal-modal-description" variant="h4" sx={{ mt: 2 }}>
          <h4>you earn {newScores} points</h4>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={()=>restartGame()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h3">
              <h3>{winner} the winner 🏆</h3>
                
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default Game
