import React, {useState, useRef} from 'react';
import WordsView from "../WordsView/WordsView";
import BrushIcon from '@mui/icons-material/Brush';
import CanvasDraw from "react-canvas-draw";
import WaitingView from '../WaitingView/WaitingView';
import "./DrawingView.css";

function DrawingView({onchooseWord,onSend,waiting}) {
  const [wordChoosing, setWordChoosing] = useState(null);
  const [color,setColor]=useState("black");

  const canvasRef = useRef(null);
  const canvas = canvasRef.current;


  const onChooseWord = (word, scores) => {
    console.log("on choose word");
    setWordChoosing(word);
    onchooseWord(word, scores);
    
  };

  const erase=()=>{
    canvasRef.current.eraseAll();
  }

  const undo=()=>{
    canvasRef.current.undo();
  }

  const sendDraw=()=>{
    const draw=canvasRef.current.getSaveData();
    onSend(draw);
  }

  return (
    <div className='drawingView'>
      {waiting && <WaitingView title="waiting for a guess"></WaitingView>}
      {!waiting && !wordChoosing && <WordsView onChoose={onChooseWord}/>}
      {!waiting && wordChoosing && (
        <>
        <h1 className="drawingView__title">Is your turn to draw <BrushIcon fontSize="huge"/></h1>
        <p className="drawingView__word">you need to draw : <span className='drawingView__word-chose'>{wordChoosing}</span></p>
        <div className="drawingView__canvas-container">
          <div className="drawingView__canvas-btns">
          <button className="drawingView__canvas-erase drawingView__canvas-btn" onClick={erase}>Erase</button>
          <button className="drawingView__canvas-undo drawingView__canvas-btn" onClick={undo}>Undo</button>
          <button className="drawingView__canvas-send drawingView__canvas-btn" onClick={sendDraw}>Send Draw</button>
          </div>
          <div className="drawingView__canvas-brush-colors">
            <button className="pink drawingView__canvas-brush-color" onClick={()=>setColor("#FF1493")}/>
            <button className="green drawingView__canvas-brush-color" onClick={()=>setColor("#3CB371")}/>
            <button className="blue drawingView__canvas-brush-color" onClick={()=>setColor("#4169E1")}/>
            <button className="purple drawingView__canvas-brush-color" onClick={()=>setColor("#BA55D3")}/>
            <button className="yellow drawingView__canvas-brush-color" onClick={()=>setColor("#FFD700")}/>
            <button className="black drawingView__canvas-brush-color" onClick={()=>setColor("black")}/>
          </div>
          
          <CanvasDraw
            brushColor={color}
            lazyRadius= {1}
            canvasWidth={220}
            canvasHeight={250}
            brushRadius={5}
            className='drwingView__canvas'
           ref={canvasRef}/>
          
        </div>
        </>
      )}
    </div>
  )
}

export default DrawingView