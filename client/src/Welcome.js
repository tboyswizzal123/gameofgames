import React, {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRecoilState} from 'recoil';
import {userNameState, screenState, gamesListState} from './atoms.js';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';




function Welcome({socket}) {
  const [userName,setUserName]=useRecoilState(userNameState);
  const [screen,setScreen]=useRecoilState(screenState);
  const [gameName,setGameName]=useState('');
  const [gamesList,setGamesList]=useRecoilState(gamesListState);

  const addUserName = (e) =>{
    e.preventDefault();
    setScreen('ready');
    
  }

  const addGame = (e) =>{
    e.preventDefault();
    socket.emit('addGame', gameName);
    setGameName('')
  }

  const deleteG=(gameName) => {
    socket.emit('deleteGame', gameName)
    setGamesList (gamesList);

}

  useEffect(()=> {

    socket= (io.connect('http://localhost:3001/'))

    socket.on('startScreen', gameList => {
      setGamesList(gameList)
    })

    socket.on('newGameList', (gameList) => {
      setGamesList(gameList);
      console.log(gamesList)
    });
  }, [])


  return (
    <div>
      
    <div className='welcome d-flex align-items-center justify-content-center flex-column'>
      <h1 className='text-center mt-5'>GAME OF GAMES</h1>
      <Form onSubmit={addUserName}  autoComplete="off" className='userName d-flex'>
              <Form.Group  className='w-75' controlId="textChat">
                <Form.Control className='w-100'type="text"  value={userName} onChange = {(e) => setUserName(e.target.value)}/>
              </Form.Group>
              <Button disabled={gamesList.length<9} variant='primary' type='submit' className='w-50 ms-3' >
                Enter NickName
              </Button>
      </Form>

      <div>
        <h3 className='mt-5'> Add game to list </h3>
        <Form onSubmit={addGame}  autoComplete="off" className='userName d-flex flex-column align-items-center'>
              <Form.Group  className='w-75' controlId="textChat">
                <Form.Control className='w-100'type="text"  value={gameName} onChange = {(e) => setGameName(e.target.value)}/>
              </Form.Group>
              <Button disabled={gamesList.length==75} variant='primary' type='submit' className='w-50 mt-2 mb-3' >
                Enter Game
              </Button>
      </Form>
      </div>


    </div>
    <div className='gamesStyle'>
    <h1 className='text-center pt-5'> GAMES LIST </h1>
    <div className='d-flex pt-5'>
    <div className='gamesList'>
      {gamesList.slice(0,15).map((game) => (
          <div className='d-flex' key={uuidv4()}>
            <li className='listStyle ms-3'> {game}</li>
            <div className="">
                            <Button className='deleteButton' onClick={()=>deleteG(game)} variant='danger'>DELETE </Button>
            </div>
          </div>
            ))}
      </div>


      <div className='gamesList'>
      {gamesList.slice(15,30).map((game) => (
          <div className='d-flex' key={uuidv4()}>
            <li className='listStyle ms-5'> {game}</li>
            <div className="">
                            <Button className='deleteButton' onClick={()=>deleteG(game)} variant='danger'>DELETE </Button>
            </div>
          </div>
            ))}
      </div>

      <div className='gamesList'>
      {gamesList.slice(30,45).map((game) => (
          <div className='d-flex' key={uuidv4()}>
            <li className='listStyle ms-5'> {game}</li>
            <div className="">
                            <Button className='deleteButton' onClick={()=>deleteG(game)} variant='danger'>DELETE </Button>
            </div>
          </div>
            ))}
      </div>

      <div className='gamesList'>
      {gamesList.slice(45,60).map((game) => (
          <div className='d-flex' key={uuidv4()}>
            <li className='listStyle ms-5'> {game}</li>
            <div className="">
                            <Button className='deleteButton' onClick={()=>deleteG(game)} variant='danger'>DELETE </Button>
            </div>
          </div>
            ))}
      </div>

      <div className='gamesList'>
      {gamesList.slice(60,75).map((game) => (
          <div className='d-flex' key={uuidv4()}>
            <li className='listStyle ms-5'> {game}</li>
            <div className="">
                            <Button className='deleteButton' onClick={()=>deleteG(game)} variant='danger'>DELETE </Button>
            </div>
          </div>
            ))}
      </div>
    </div>
    </div>
    </div>
  )
}

export default Welcome