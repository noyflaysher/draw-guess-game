import React, { useEffect, useState } from 'react';
import "./WordsView.css";



function WordsView({onChoose}) {
    const [words,setWords]=useState([]);
    var randomWords = require('random-words');

    useEffect(()=>{
        const easyWord=randomWords({exactly:1, minLength: 2, maxLength: 3})[0];
        console.log(`easy ${easyWord}`);
        const mediumWord=randomWords({exactly:1,minLength: 4, maxLength: 5 })[0];
        console.log(`madium ${mediumWord}`);
        const hardWord=randomWords({exactly:1, minLength: 6})[0];
        console.log(`hard ${hardWord}`);
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