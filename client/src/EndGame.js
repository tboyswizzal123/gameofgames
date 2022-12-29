import React from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import {leastCardsPlayerState, trashModalState, userNameState, screenState, usersState, gamesListState} from './atoms.js';
import {useRecoilState} from 'recoil';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';

function EndGame() {
const [leastCardsPlayer, setLeastCardsPlayer] = useRecoilState(leastCardsPlayerState);
const [users, setUsers] = useRecoilState(usersState);
const [screen,setScreen]=useRecoilState(screenState);

const reload = () =>{
    window.location.reload();
}


  return (
    <div className='endGame d-flex flex-column align-items-center'>
        <div className=' d-flex flew-row justify-content-between'>
            <h1 className='text-light d-flex align-items-center ms-3'>GAME OVER</h1>
        </div>
        <div className=''>
            <h2 className='ms-3 text-decoration-underline text-success'>BIG LOSER(S) YOU SUCK</h2>
            {leastCardsPlayer.map((name)=>(
                <div className='ms-3 mt-3'>
                    <li key={uuidv4()}>
                        <h3 className='text-light'>{name} </h3>
                    </li>
                </div>
            ))}
        </div>
        <h3 className='mt-5 text-light'> congrats everyone else for not losing!</h3>
        <div className=' d-flex align-items-center'>
        
        <Button variant='danger' onClick={reload} className='w-100 ms-3' >
                Back to home screen
        </Button>
        </div>
    </div>
  )
}

export default EndGame