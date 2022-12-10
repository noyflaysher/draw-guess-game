import React, { useEffect, useState } from 'react';
import "./WordsView.css";

function WordsView({onChoose}) {
    const [words,setWords]=useState([]);
    let randomWords = require('random-words');

    useEffect(()=>{
        const easyWord=randomWords({exactly:1, minLength: 3, maxLength: 4})[0];
        const mediumWord=randomWords({exactly:1,minLength: 5, maxLength: 5 })[0];
        const hardWord=randomWords({exactly:1, minLength: 6})[0];
        setWords([easyWord,mediumWord,hardWord]);
    },[])
  return (
    <div className='wordsView'>
        <h2 className="wordsView__title">Choose a word difficulty level</h2>
        <div className="wordsView__btns">
            <button className="wordsView__word-easy wordsView__word-btn" onClick={()=>onChoose(words[0],1)}>Easy</button>
            <button className="wordsView__word-medium wordsView__word-btn" onClick={()=>onChoose(words[1],3)}>Medium</button>
            <button className="wordsView__word-large wordsView__word-btn" onClick={()=>onChoose(words[2],5)}>Hard</button>
        </div>
        <div className="points">
            <div className="easy">1 point</div>
            <div className="easy">3 points</div>
            <div className="easy">5 points</div>
        </div>
        
    </div>
  )
}

export default WordsView