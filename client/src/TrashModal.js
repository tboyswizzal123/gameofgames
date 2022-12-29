import React from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import {trashModalState, userNameState, screenState, usersState, gamesListState} from './atoms.js';
import {useRecoilState} from 'recoil';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';

function TrashModal({trash}) {

const [trashModal,setTrashModal] = useRecoilState(trashModalState);
  return (
    <div className='myModal d-flex flex-column'>
        <div className='modalTop d-flex flew-row justify-content-between'>
            <h1 className='text-light d-flex align-items-center ms-3'>Trash</h1>
            <CloseButton onClick={()=> setTrashModal(false)}/>
        </div>
        <div className='midMod'>
            <h2 className='ms-3 text-decoration-underline text-success'>Games List</h2>
            <div className='modList d-flex ms-3'>
            {trash.map((game) => (
                <div>
                    <li key={uuidv4()}>
                        <h3 className='faceUp'>{game}</h3>
                    </li>
                </div>
            
        ))}
                </div>
        </div>
        <div className='bottomModal d-flex align-items-center'>
        <Button variant='danger' onClick={()=> setTrashModal(false)} className='w-25 ms-3' >
                Close
        </Button>
        </div>
    </div>
  )
}

export default TrashModal