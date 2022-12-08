import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import "./WaitingView.css"

function WaitingView({title}) {
  return (
    <div className='waitingView'>
      <h1 className="waitingView__title">{title}</h1>
      <LoadingSpinner className="waitigView__spinner"/>
    </div>
  )
}

export default WaitingView