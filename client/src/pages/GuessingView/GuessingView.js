import React, {useRef, useEffect} from 'react';
import WaitingView from '../WaitingView/WaitingView';
import CanvasDraw from "react-canvas-draw";
import "./GuessingView.css"

function GuessingView({waiting,drawingImg,success}) {
  const canvasRef = useRef(null);
  var canvasObject = canvasRef.current;
  const wordRef=useRef("");

  useEffect(() => {
    canvasObject = canvasRef.current;
    if (canvasObject && drawingImg) canvasObject.loadSaveData(drawingImg);
  }, [waiting]);

  const sendGuess=()=>{
    success(wordRef.current);
  }


  return (
    <div className='guessingView'>
      {waiting && <WaitingView title="waiting for draw"/>}
      {!waiting && (
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