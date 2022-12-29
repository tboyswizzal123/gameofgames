import React from 'react'
import CloseButton from 'react-bootstrap/CloseButton';
import {leastCardsPlayerState,pityPrizeState, potluckState, manyChoicesState, futureState,notThatOneState, loserState, overConfidenceState, winnerState, handState, eventModalState, eventState, eventButtonState, trashState, gameModalState, modalState, userNameState, screenState, usersState, gamesListState} from './atoms.js';
import {useRecoilState} from 'recoil';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import {useState, useRef, useEffect} from 'react';

function EventModal({socket}) {

const [modal,setModal] = useRecoilState(eventModalState);
const [users, setUsers] = useRecoilState(usersState);
const [userName,setUserName]=useRecoilState(userNameState);
const [trash,setTrash] = useRecoilState(trashState);
const [event, setEvent] = useRecoilState(eventState);
const [hand, setHand]=useRecoilState(handState);
const [tempHand, setTempHand]=useState(hand);
const [leastCardsPlayer, setLeastCardsPlayer] = useRecoilState(leastCardsPlayerState);
const [winner,setWinner]= useRecoilState(winnerState)
const [leastRandomPlayer, setLeastRandomPlayer] = useState(null)
const [garbagePick, setGarbagePick] = useState(false)
const [shuffled, setShuffled] = useState([]);
const [gameSelect,setGameSelect]=useState(false);
const [nextPlayer, setNextPlayer] = useState(users[0]);
const [overConfidence, setOverConfidence]=useRecoilState(overConfidenceState);
const [loser, setLoser]=useRecoilState(loserState);
const [notThatOne, setNotThatOne]=useRecoilState(notThatOneState);
const [future, setFuture]=useRecoilState(futureState);
const [manyChoices, setManyChoices]=useRecoilState(manyChoicesState);
const [potluck, setPotluck]=useRecoilState(potluckState);
const [pityPrize, setPityPrize]=useRecoilState(pityPrizeState);
const [eventButton,setEventButton]=useRecoilState(eventButtonState)

const takeOrSelect = (shuffled, game) =>{
    
    if(gameSelect==false){
        socket.emit('flipGarbage', shuffled, game)
    }

    if(gameSelect==true){  
      socket.emit('takeGarbage', shuffled, game, userName)
      setEventButton(!eventButton)
    }
    
    
}

const concede = () =>{
    socket.emit('gameOver');
  }
 


const discardRandom = () => {
    setModal(false)
    socket.emit('discardRandom')
}


const discardChosen = (game) => {
    setModal(false)
    socket.emit('discardChosen', (game))
    
}

const swapRandom = () => {
    for(let i=0; i<users.length; i++){
        if (users[i].name==userName){
            if (i+1!=users.length){
                socket.emit('swapRandom', {swappedID: users[i+1].id,tempHand:tempHand})
                console.log(users[i+1].id)
            }
            if (i+1==users.length){
                socket.emit('swapRandom', {swappedID: users[0].id,tempHand:tempHand})
                console.log(users[0].id)
            }
        }
    }
    setModal(false)
}


const swapChosen = (game) => {
    for(let i=0; i<users.length; i++){
        if (users[i].name==userName){
            if (i+1!=users.length){
                socket.emit('swapChosen', {swappedID: users[i+1].id,tempHand:tempHand, game:game})
                console.log(users[i+1].id)
            }
            if (i+1==users.length){
                socket.emit('swapChosen', {swappedID: users[0].id,tempHand:tempHand, game:game})
                console.log(users[0].id)
            }
        }
    }
    setModal(false)
}

const gainRandomGarbage = () => {
    if(leastCardsPlayer.includes(userName)){
        socket.emit('gainRandomTrash')
    }
    setModal(false)
}

const winnerGainRandomGarbage = () => {
    if(winner==userName){
        socket.emit('gainRandomTrash')
    }
    setModal(false)
}

const soulForSoul = () => {
    if (winner==userName){
        socket.emit('gainRandomTrash')
        socket.emit('discardRandom')
    }
    setModal(false)
}



const gainGarbage = () => {
    setGarbagePick(true)
}

const chooseGarbage = (game) => {
    socket.emit('pushGarbage', (game))
    setModal(false)
}

const nextWinnerGainRandomGarbage = () => {
    socket.emit('nextWinnerGainRandomTrash')
    setModal(false)
}

const gainTrash = () =>{
    socket.emit('gainRandomTrash')
    setModal(false)
}

const notThatOneF = () => {
    setNotThatOne(true)
    setModal(false)
}


const soManyChoices = (game) =>{
    socket.emit('soManyChoices', (game))
    setModal(false)
}

const backToTheFuture = (game) =>{
    socket.emit('backToFuture',(game))
    setModal(false)
}


const potLuck = () => {
    setPotluck(true)
    setModal(false)
}

const goFish = (game) => {
    console.log(game)
    socket.emit('takePlayerCard', ({game:game, id:nextPlayer.id}))
    setModal(false)
}

const pityprize = () => {
    setPityPrize(true)
    setModal(false)
}

const overConfident = (game) =>{
    socket.emit('overConfidence', (game))
    
    setModal(false)
}



const charity = (game) => {
    for(let i=0; i<users.length; i++){
        if (leastRandomPlayer==users[i].name){
            var id=users[i].id
            
        }
    }

    if(winner==userName && !(leastCardsPlayer.includes(winner))){
        socket.emit('charity', {player:leastRandomPlayer, id:id, hand:hand, game:game})
    }
    setModal(false)
    
}

const playedTooWell = () => {
    for(let i=0; i<users.length; i++){
        if (leastRandomPlayer==users[i].name){
            var id=users[i].id
            
        }
    }

    if(winner==userName && !(leastCardsPlayer.includes(winner))){
        socket.emit('playedTooWell', {player:leastRandomPlayer, id:id, hand:hand})
    }
    setModal(false)
}
    


  useEffect(()=>{


    socket.emit("shuffleTrash");


    socket.on('shuffledTrash', newTrash =>{
        setShuffled(newTrash)
    })

    for(let i=0; i<users.length; i++){
        if (users[i].name==userName){
            if (i+1!=users.length){
                setNextPlayer(users[i+1])
            }
            if (i+1==users.length){
                setNextPlayer(users[0])
            }
        }
    }

    socket.on('tookGarbage', (info) =>{
        setTrash(info.trash)
        setUsers(info.users)
        setGameSelect(gameSelect=>!gameSelect)
        setWinner(info.winner)
        setModal(false)
        
    })
    
    socket.on('flippedGarbage', (newUsers,trazh) =>{
        setShuffled(newUsers)
        setTrash(trazh)
        setGameSelect(gameSelect=>!gameSelect)
    })  

    socket.emit('getLeastCardedPlayer', (users))

    socket.on('giveLeastCardedPlayer', leastCrds =>{
        setLeastCardsPlayer(leastCrds)
        var rando=(Math.floor(Math.random() * leastCrds.length))
        if(winner==userName){
            socket.emit('setLeastRandomPlayer', (leastCrds[rando]))
        }
        
    }) 

    socket.on('setLeastRandomPlayerFinish', (random)=>{
        setLeastRandomPlayer(random);
    })



    socket.on('toTheFuture', (uzers) => {
        setUsers(uzers)
        setFuture(true)
    })

    socket.on('allTheChoices', (uzers) => {
        setUsers(uzers)
        setManyChoices(true)
    })

    socket.on('randomDiscarded', (info)=>{
        setUsers(info.users)
        setTrash(info.trash)

      })

      socket.on('chosenDiscarded', (info)=>{
        setUsers(info.users)
        setTrash(info.trash)

      })

      socket.on('randomSwapped', (usas) =>{
        setUsers(usas)
      })

      socket.on('chosenSwapped', (usas) =>{
        setUsers(usas)
      })

      socket.on('randomTrashGained', (info) =>{
        setUsers(info.users)
        setTrash(info.trash)
      })

      socket.on('playedTooWellFinish', (usas) =>{
        setUsers(usas)
      })

      socket.on('charityEnd', (usas) =>{
        setUsers(usas)
      })

      socket.on('pushedGarbage', (info) =>{
        setUsers(info.users)
        setTrash(info.trash)
      })

      socket.on('playerCardTook', (usas) =>{
        setUsers(usas)
      })

      socket.on('overconfident', (info) =>{
        setOverConfidence(info.game)
        setUsers(info.users)
      })

  }, [])

  return (
    <div className='eventModal'>
        {event==1 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >Discard Random</h1>
            <div className=' d-flex flex-row modList'> 
            {hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        
          </div>
          <Button variant='danger' onClick={discardRandom} className='discardButton'>DISCARD RANDOM </Button>
        </div>}

        {event==2 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >Discard Chosen</h1>
            <div className=' d-flex flex-row modList'> 
            {hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>discardChosen(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        
          </div>
        </div>}

        {event==3 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >Swap Random</h1>
            <div className=' d-flex flex-row modList'> 
            {tempHand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        
          </div>
          <Button variant='danger' onClick={swapRandom} className='discardButton'>SWAP RANDOM </Button>
        </div>}

        {event==4 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >Swap Chosen</h1>
            <div className=' d-flex flex-row modList'> 
            {tempHand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>swapChosen(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
            
        ))}
        
          </div>
        </div>}

        {event==5 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >SO MANY CHOICES</h1>
            <h2 className='text-light text-center'>pick extra card to go into the next round</h2>
            <h2 className='text-light text-center'>everyone gets AT LEAST one card back this turn</h2>
            <div className=' d-flex flex-row modList'> 
            {hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>soManyChoices(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        
          </div>
        </div>}

        {event==6 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >SOUL FOR A SOUL</h1>
            <h2 className='text-light text-center'>{winner} randomly discard card and gain from garbage </h2>
          <Button variant='primary' onClick={soulForSoul} className='discardButton'>SOUL FOR SOUL</Button>
        </div>}

        {event==7 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >ID BUY THAT FOR A DOLLAR</h1>
            <h2 className='text-light text-center'>{winner} did you go to someones house and give them a physical dollar? </h2>
            {!garbagePick ? <div className='d-flex flex-row'>
            <Button variant='danger' onClick={()=>setModal(false)} className='discardButton'>youre a normal person </Button>
            <Button variant='success' disabled={!(winner==userName)} onClick={gainGarbage} className='discardButton'>you actually drove </Button>
            </div>:
            <div className='midMod'>
            <h2 className='ms-3 text-decoration-underline text-success'>Games List</h2>
            <div className='modList d-flex ms-3'>
                {trash.map((game) => (
                    <div>
                        <li key={uuidv4()}>
                            <h3 className='faceUp' onClick={()=>chooseGarbage(game)}>{game}</h3>
                        </li>
                    </div>
                    ))}
                    </div>
            </div>}

        
        </div>}

        {event==8 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >BACK TO THE FUTURE</h1>
            <h2 className='text-light text-center'>SEND A CARD INTO THE FUTURE</h2>
            <div className=' d-flex flex-row modList'> 
            {hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>backToTheFuture(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
                    {hand.length==0 && 
                      <Button onClick={concede}  variant={'danger'} className='w-100' >
                      CONCEDE
                    </Button>}
        
          </div>
        </div>}

        {event==9 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >POTLUCK</h1>
            <h2 className='text-light text-center'>losers of next round put extra card in for winner to choose from </h2>
          <Button variant='primary' onClick={potLuck} className='discardButton'>POT LUCK</Button>
        </div>}




        {event==10 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >LEAST CARDS RANDOM JUNK</h1>
            <h2 className='text-light text-center'>Congratulations. Click to claim your prize </h2>
            <div className='d-flex flex-row'>
            {leastCardsPlayer.map((name)=>(
                <div className='ms-3 mt-3'>
                    <li key={uuidv4()}>
                        <h3 className='text-light'>{name} </h3>
                    </li>
                </div>
            ))}
            </div>
          <Button variant='success' onClick={gainRandomGarbage} className='discardButton'>GAIN RANDOM GARBAGE </Button>
        </div>}


        {event==11 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >NEXT WINNER RANDOM JUNK</h1>
            <h2 className='text-light text-center'>Next Winner gains prize! </h2>
          <Button variant='primary' onClick={nextWinnerGainRandomGarbage} className='discardButton'>continue </Button>
        </div>}

        {event==12 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >LAST WINNER RANDOM JUNK</h1>
            <h2 className='text-light text-center'>Congratulations. {winner} Click to claim your prize </h2>
          <Button variant='success' onClick={winnerGainRandomGarbage} className='discardButton'>GAIN RANDOM GARBAGE </Button>
        </div>}

        {event==13 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >NOT THAT ONE</h1>
            <h2 className='text-light text-center'>Congratulations. {winner} the first card you choose next round goes back to the original person </h2>
          <Button variant='primary' onClick={notThatOneF} className='discardButton'>NOT THAT ONE </Button>
        </div>}

        {event==14 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >GO FISH</h1>
            <h2 className='text-light text-center'>{userName} take from {nextPlayer.name} </h2>
                      <div className=' d-flex flex-row modList'> 
            {nextPlayer.hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>goFish(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        </div>
        </div>}

        {event==15 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >PITY PRIZE</h1>
            <h2 className='text-light text-center'>BIG LOSER of next game gets discarded card back</h2>

          <Button variant='danger' onClick={pityprize} className='discardButton'>BIG LOSER </Button>
        </div>}

        {event == 16 && <div className='gameModal d-flex flex-column'>
            <h1 className='text-light text-center mt-5'>DUMPSTER DIVING</h1>
            {gameSelect==false && <h2 className='ms-3  text-light text-center'>{winner} flip trash</h2>}
            {gameSelect==true && <h2 className='ms-3  text-light text-center'>Winner Select Trash</h2>}
        <div className='midMod'>
            <h2 className='ms-3 text-decoration-underline text-success'>Games List</h2>
            <div className='cardSpots d-flex flex-row justify-content-center mt-5'>
            {shuffled.map((shuff)=>(

                <div>
                    <li key={uuidv4()}>
                        <div className='cardSpot'>
                        {shuff.flipped==false ? <div onClick={()=>takeOrSelect(shuffled,shuff.name) } className='faceDown x'/> : <div className='faceUp x'>{shuff.name}</div>}
                        </div>  
                    </li>
                </div>
            
        ))}
            </div>
        </div>
        </div>}

        {event==17 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >VOLCANO</h1>
            <h2 className='text-light text-center'>EVERYONE WINS A FREE GARBAGE </h2>
          <Button variant='success' onClick={gainTrash} className='discardButton'>GAIN RANDOM GARBAGE </Button>
        </div>}

        {event==18 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >OVER CONFIDENCE</h1>
            <h2 className='text-light text-center'>{winner} Puts two games in. Next Winner gets two </h2>
            {winner==userName&& <h2 className='text-light text-center'>choose extra card to put down for next round </h2>}
            <div className=' d-flex flex-row modList'>
            {winner==userName &&  hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>overConfident(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        </div>
          {winner!=userName &&<Button variant='success' onClick={()=>setModal(false)} className='discardButton'>OVER CONFIDENCE </Button>}
        </div>}

        {event==19 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >CHARITY</h1>
            {!leastCardsPlayer.includes(winner) ? <h2 className='text-light text-center'>{winner} gives chosen card to {leastRandomPlayer} </h2>
            :<h2 className='text-light text-center'>wow you suck. nothing happens </h2> }
                      <div className=' d-flex flex-row modList'> 
            {hand.map((game) => (
                  <div className='' >
                      <li key={uuidv4()}>
                          <h3  onClick={()=>charity(game)} className='faceUp ' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
        
          </div>
          {!(winner==userName && !leastCardsPlayer.includes(userName)) && <Button variant='primary' onClick={()=>setModal(false)} className='discardButton'>close </Button>}
        </div>}

        {event==20 && 
        <div className='discardCard  d-flex flex-column align-items-center'>
            <h1 className='text-light text-center mt-5' >PLAYED TOO WELL</h1>
            {!leastCardsPlayer.includes(winner) ? <h2 className='text-light text-center'>{winner} gives random card to {leastRandomPlayer} </h2>
            :<h2 className='text-light text-center'>wow you suck. nothing happens </h2> }
          <Button variant='primary' onClick={playedTooWell} className='discardButton'>continue </Button>
        </div>}


    </div>
  )
}

export default EventModal