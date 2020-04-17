import React from 'react';
import './App.css';
import Gameboard from './Gameboard';


function App() {
  return (
    <div className="App">
      <h1> JavaScript Reversi </h1>
      <Gameboard size='8' />
    </div>
  );
}

export default App;