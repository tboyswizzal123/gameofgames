import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useRef, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {startHandSizeState, trashModalState, trashState, modalState, userNameState, screenState, usersState, gamesListState} from './atoms.js';
import Modal from './Modal.js'
import TrashModal from './TrashModal.js'
import { v4 as uuidv4 } from 'uuid';

function Selection({socket}) {
const [users, setUsers] = useRecoilState(usersState);
const [gamesList,setGamesList]=useRecoilState(gamesListState);
const [title, setTitle] = useState('hi');
const [selectGameList, setSelectGameList] = useState(gamesList);
const [modal,setModal] = useRecoilState(modalState);
const [modalUser, setModalUser] = useState('false')
const [modalHand, setModalHand] = useState([]);
const [modalID, setModalID] = useState('sa');
const [playerPicking, setPlayerPicking] = useState('');
const [keepOrDiscard, setKeepOrDiscard] = useState('keep');
const [trashCount, setTrashCount] = useState(0);
const [trash,setTrash] = useRecoilState(trashState);
const [trashModal,setTrashModal] = useRecoilState(trashModalState);
const [startHandSize, setStartHandSize] = useRecoilState(startHandSizeState);
const [gameStartCount, setGameStartCount] = useState(startHandSize);
const [FinalGameReady, setFinalGameReady] = useState(false);
const [screen,setScreen]=useRecoilState(screenState);  
const [userName,setUserName]=useRecoilState(userNameState);      
var counter=0;
var switchCase=true;


const switchUsers = (name, hand, id) => {
    setModal(true);
    setModalUser(name);
    setModalHand(hand);
    setModalID(id);

}

const startGame = () => {
    socket.emit('FullStart')
}




useEffect(() => {
    var x = gameStartCount;
    setPlayerPicking(users[0].name);


    socket.on('fullStartGame', () => {
        setScreen('app')
      });

    socket.on('addToHand', userHandInfo => {
        setUsers(userHandInfo.users)
        setTrash(userHandInfo.trash)
        setTrashCount(userHandInfo.trashCount)
        
        if (counter==users.length-1){
            switch(switchCase){
                case true: 
                    setKeepOrDiscard('discard')
                    break;
                case false:
                    setGameStartCount(gameStartCount => gameStartCount-1);
                    x=x-1
                    setKeepOrDiscard('keep')
                    break;
            }
            if(x==0){
                    setFinalGameReady(true);
            }
            switchCase=!switchCase
            counter=0;
            setPlayerPicking(users[counter].name)
            if(gameStartCount==0){
                setFinalGameReady(true);
            }
        }

        else if (counter<users.length){
            counter++;
            setPlayerPicking(users[counter].name)
        }

        setSelectGameList(selectGameList => {
            return selectGameList.filter(game => game!==userHandInfo.game)
        })



    });
}, [])
  return (

    <div className='selekt d-flex align-items-center justify-content-center flex-column'>
        {trashModal && <TrashModal trash={trash}/> }
        {modal && <Modal name={modalUser} hand={modalHand}/> }
        
        <div className='selectionHeader '>
            <h1>Selection Screen</h1>
            <h3>{playerPicking} choose a card to {keepOrDiscard}</h3>
            <h3>{gameStartCount} left to go</h3>
        </div>
        {!FinalGameReady && <div className='selectionCards d-flex'>
            {selectGameList.map((game) => (
                <div>
                    <li key={uuidv4()} onClick={()=> {if(playerPicking==userName){   socket.emit("selectCard", game, keepOrDiscard)}}} className='faceUp'>{game}</li>
                </div>
            ))}
        </div>}

        {(FinalGameReady  ) && <div className='startGame'>
        <Button onClick={startGame}>
          Start game!
        </Button>
        </div>}
            <div className='selectionUsers d-flex align-items-center'>
              <h3 >Users: </h3>
               {users.map(({name, id, handSize, hand }) => ( 
                  
             <div className='d-flex m-2'>
              <div className='d-flex flex-column mt-3'>
                  <li key={id}>  
                  <h4 >{name}: {handSize}</h4>
                  </li>
                   <a onClick={() => switchUsers(name, hand, id)} className='text-primary'>View Cards</a> 
                
               </div>
             </div>
         ))}
         <div  onClick={()=> setTrashModal(true)} className='trashSide'>
            <h3 > garbage: {trashCount}</h3>
            <svg  xmlns="http://www.w3.org/2000/svg"  className='ms-4'width="32" height="32" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>
        </div>
            </div>

            

    </div>
  )
}

export default Selection