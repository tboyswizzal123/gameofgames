import React from 'react'
import {useState, useEffect} from 'react';
import Welcome from './Welcome.js';
import App from './App.js';
import {screenState} from './atoms.js';
import {useRecoilState} from 'recoil';
import Ready from './Ready';
import Selection from './Selection'
import io from 'socket.io-client';
import EndGame from './EndGame'

function Main() {
  const [socket, setSocket]=useState(null)
  useEffect(()=>{
    setSocket(io.connect('http://localhost:3001/'))
  }, []);

  const [screen,setScreen]=useRecoilState(screenState);
  return (
    <div>
        {screen=='ready' && <Ready socket={socket}/>}
        {screen=='welcome' && <Welcome socket={socket}/>}
        {screen=='app' && <App socket={socket}/>}
        {screen=='selection' && <Selection socket={socket}/>}
        {screen=='endGame' && <EndGame />}
    </div>
  )
}

export default Main