import React from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import {pityPrizeState, handState,potluckState, manyChoicesState, theFutureState,futureState, notThatOneState, loserState, overConfidenceState, playerNextWinState,winnerState, eventButtonState, trashState, gameModalState, modalState, userNameState, screenState, usersState, gamesListState} from './atoms.js';
import {useRecoilState} from 'recoil';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import {useState, useRef, useEffect} from 'react';

function GameModal({users, socket}) {

const [modal,setModal] = useRecoilState(gameModalState);
const [userz, setUserz] = useRecoilState(usersState);
const [shuffled, setShuffled] = useState([]);
const [gameSelect,setGameSelect]=useState(false);
const [userName,setUserName]=useRecoilState(userNameState);
const [trash,setTrash] = useRecoilState(trashState);
const [eventButton,setEventButton] = useRecoilState(eventButtonState);
const [winner, setWinner]= useRecoilState(winnerState);
const [playerNextWin, setPlayerNextWin]=useRecoilState(playerNextWinState)
const [overConfidence, setOverConfidence]=useRecoilState(overConfidenceState);
const [loser, setLoser]=useRecoilState(loserState);
const [notThatOne, setNotThatOne]=useRecoilState(notThatOneState);
const [future, setFuture]=useRecoilState(futureState);
const [theFuture, setTheFuture]=useRecoilState(theFutureState);
const [manyChoices, setManyChoices]=useRecoilState(manyChoicesState);
const [potluck, setPotluck]=useRecoilState(potluckState);
const [hand, setHand]=useRecoilState(handState);
const [pityPrize, setPityPrize]=useRecoilState(pityPrizeState);

const takeOrSelect = (shuffled, name, game) =>{
    
    if(gameSelect==false && winner==userName){
      if(notThatOne==true){
        socket.emit('notThatCard', shuffled, name, game)
      }
      else{
        socket.emit('flipCard', shuffled, name, game)
      }
        
    }
    if(gameSelect==true){

      if(potluck==true){
        socket.emit('potfuck', {userz:userz,shuffled:shuffled,game:game,name:userName})        
      }

      if(playerNextWin==true){
        socket.emit('gainRandomTrashTwo')
      }

      if(overConfidence!=''){
        socket.emit('takeTwoCards', {shuffled:shuffled, game:game})
      }

      if (loser!=''){
        socket.emit('takeCardLoser', shuffled, game, userName,loser)
      }

      if(manyChoices == true){
        socket.emit('takeCard&random', userz, shuffled, game, userName)
      }


      
      if(overConfidence=='' && loser=='' && manyChoices==false && potluck==false && pityPrize==false){
        socket.emit('takeCard', shuffled, game, userName)
      }
      
    }


    
    
}

const concede = () =>{
  socket.emit('gameOver');
}



  useEffect(()=>{
    if (overConfidence!=''){
      socket.emit("shuffleConfidence", {users:users, game:overConfidence});
    }

    if (overConfidence=='' && manyChoices==false){
      socket.emit("shuffle", users);
    }

    if (manyChoices==true){
      socket.emit("shuffleAllChoices", userz)
      
    }
    


    socket.on('shuffled', newUsers =>{
        setShuffled(newUsers)
    })

    socket.on('shuffledP', info =>{
      setShuffled(info.newUsers)
      setUserz(info.users)

  })

  
      socket.on('clearEverything', newUsers => {
        setUserz(newUsers)
        setModal(false)
        setEventButton(!eventButton)
      })


    socket.on('tookCard', (info) =>{
        setTrash(info.trash)
        setUserz(info.users)
        setGameSelect(gameSelect=>!gameSelect)
        setWinner(info.winner)
        if (future==false){
          setTheFuture(false)
          socket.emit('clearPlaced');
        }
        if (future==true){
          setTheFuture(true)
          setFuture(false)
          socket.emit('inTheFuture')
          
        }
        if (potluck==true){
          setPotluck(false)
        }
        
        
    })

    socket.on('loserTookCard', (info) =>{
      setUserz(info.users)
      setGameSelect(gameSelect=>!gameSelect)
      setWinner(info.winner)
      setLoser('')
      socket.emit('clearPlaced');

      
  })

    socket.on('tookTwo', (info) =>{
      setUserz(info.users)
      setShuffled(info.shuffle)
      setOverConfidence('')
      
  })
    
    socket.on('flippedCard', (newUsers) =>{
        setShuffled(newUsers)
        
        setGameSelect(gameSelect=>!gameSelect)


        
    })  

    socket.on('loserSet', (name) =>{
      setLoser(name)
      setPityPrize(false)
  })

    socket.on('nextWin', nextWin =>{
      setPlayerNextWin(nextWin)
    })

    socket.on('randomTrashGainedTwo', (info) =>{
      setUserz(info.users)
      setTrash(info.trash)
      setPlayerNextWin(false)
    })

    socket.on('notThatOneDone', (info) =>{
      setUserz(info.users)
      setShuffled(info.shuff)
      setNotThatOne(false)
    })

  }, [])

  return (
    <div className='gameModal d-flex flex-column'>
            <h1 className='text-light text-center mt-5'>Actions and Events</h1>
            {gameSelect==false && <h2 className='ms-3  text-light text-center'>{winner} flip card</h2>}
            {gameSelect==true && <h2 className='ms-3  text-light text-center'>Winner Select Card</h2>}
        <div className='midMod'>
            <h2 className='ms-3 text-decoration-underline text-success'>Games List</h2>
            <div className='cardSpots d-flex flex-row justify-content-center mt-5'>
            {shuffled.map((shuff)=>(

                <div>
                    <li key={uuidv4()}>
                        <div className='cardSpot'>
                        {shuff.flipped==false ? <div onClick={()=>takeOrSelect(shuffled,shuff.name,shuff.cardPlaced) } className='faceDown x'/> : <div className='faceUp x'>{shuff.cardPlaced}</div>}
                        </div>  
                    </li>
                </div>
            
        ))}
                </div>
        </div>
        <div className='gameBottomModal d-flex align-items-center'>
        {pityPrize && <Button variant='danger' onClick={()=>socket.emit('setLoser')} className='discardButton'>BIG LOSER </Button>}
        {potluck &&
        <div className='midMod d-flex flex-column align-items-center'>
        <h2 className='ms-3 text-decoration-underline text-success'>click on card ONLY IF LOSER for this round</h2>
        <div className='cardSpots d-flex flex-row justify-content-center mt-5'>
        {hand.map((game)=>(

            <div>
                <li key={uuidv4()}>
                    { <div onClick={()=>socket.emit('addPotLuck', {shuffled:shuffled, game:game})} className='faceUp x'>{game}</div>}
                </li>
            </div>
        
    ))}
            </div>
            {hand.length==0 && 
                      <Button onClick={concede}  variant={'danger'} className='w-25' >
                      CONCEDE
                    </Button>}
    </div>}
        </div>
    </div>
  )
}

export default GameModal