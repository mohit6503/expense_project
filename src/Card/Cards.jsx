import React from 'react';
import './Cards.css';

function Card(props) {
  return (
    <div className="transaction">
      <div className="left">
        <div className='name'>{props.name}</div>
        <div className='description'>{props.description}</div>
      </div>
      <div className="right">
        <div className={"price " + (props.price < 0 ? 'red' : 'green')}>{props.price}</div>
        <div className="datetime">{props.date}</div>
      </div>
    </div>
  );
}

export default Card;
