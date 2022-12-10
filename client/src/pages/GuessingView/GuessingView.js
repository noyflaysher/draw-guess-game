import React, {useRef, useEffect} from 'react';
import WaitingView from '../WaitingView/WaitingView';
import CanvasDraw from "react-canvas-draw";
import "./GuessingView.css"

function GuessingView({waiting,drawingImg,success}) {
  const canvasRef = useRef(null);
  let canvas;
  const wordRef=useRef("");

  useEffect(() => {
    canvas = canvasRef.current;
    if (canvas && drawingImg) canvas.loadSaveData(drawingImg);
  }, [waiting]);

  const sendGuess=()=>{
    success(wordRef.current);
  }


  return (
    <div className='guessingView'>
      {waiting ? <WaitingView title="waiting for draw"/> :
      (
        <div className="guessingView__container">
          <h1>Guess what is the word</h1>
          <CanvasDraw
            disabled={true}
            canvasWidth={220}
            hideGrid={true}
            canvasHeight={250}
            ref={canvasRef}
            className='drwingView__canvas'
           />
           <input ref={wordRef} type="text" className="guessingView__guess" placeholder='What is the word?' />
           <button className="guessingView__btn" onClick={sendGuess}>send guess</button>
        </div>
        
      )}
    </div>
  )
}

export default GuessingView