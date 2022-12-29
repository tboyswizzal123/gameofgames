import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameModal from './GameModal.js'
import {useState, useRef, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import { theFutureState, winnerState, handState, eventState, eventModalState, eventButtonState, gameModalState, userNameState, screenState, trashModalState, usersState, trashState} from './atoms.js';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Draggable, {DraggableCore} from "react-draggable";
import ReactCardFlip from "react-card-flip";
import TrashModal from './TrashModal.js'
import EventModal from './EventModal.js'



function App({socket}) {
  const [users, setUsers] = useRecoilState(usersState);
  const [screen,setScreen]=useRecoilState(screenState);
  const [userName,setUserName]=useRecoilState(userNameState);
  const [hand, setHand]=useRecoilState(handState);
  const [textChat, setTextChat] = useState('');
  const [chat, setChat]= useState([]);
  const [roundCount, setRoundCount]=useState(0);
  const [instructions, setInstructions] = useState('Click to place card down')
  const [round,setRound]=useState('preRound')
  const [currentCardInPlay, setCurrentCardInPlay] = useState(null)
  const [flip, setFlip] = useState(false);
  const [gameModal, setGameModal] = useRecoilState(gameModalState);
  const [gameStart,setGameStart] = useState(false);
  const dummy=useRef();
  const [diceNumber,setDiceNumber] = useState(0)
  const [trashModal,setTrashModal] = useRecoilState(trashModalState);
  const [eventModal,setEventModal] = useRecoilState(eventModalState);
  const [trash,setTrash] = useRecoilState(trashState);
  const [eventButton,setEventButton] = useRecoilState(eventButtonState);
  const [rollTitle, setRollTitle]=useState('click to roll');
  const [event, setEvent]=useRecoilState(eventState);
  const [winner, setWinner]= useRecoilState(winnerState);
  const [secondCard, setSecondCard] = useState('')
  const [theFuture, setTheFuture]=useRecoilState(theFutureState);


  
  const concede = () =>{
    socket.emit('gameOver');
  }

  const setCard = (game) =>{
    for (let i=0; i<users.length; i++){
      if(users[i].name==userName && users[i].cardPlaced==''){
        socket.emit('sendCard',(game))
      }

    } 
    
  }

  const switchCard = (cardPlaced) =>{
    socket.emit('swapCard', cardPlaced)
  }

  const addChat = event =>{
    event.preventDefault();
    socket.emit("send_message", textChat);
    setTextChat('');
    
  }



  

  useEffect(() =>{



    if(winner==null){
      setWinner(users[0].name)
    }


    for (let i=0; i<users.length; i++){
      if (users[i].name==userName){
        setHand(users[i].hand);
      }
    }

    socket.on('finishScreen', (trazh)=>{
      setTrash(trazh);
      setScreen('endGame')
    })

    socket.on('diceRolled', number =>{
      setDiceNumber(number);
      switch(number){
        case 1: 
          setRollTitle(rolltitle=>'DISCARD RANDOM')
          setEvent(event=>1);
          setEventModal(true);
          setEventButton(false)
          break;
        case 2:
          setRollTitle(rolltitle=>'DISCARD CHOSEN')
          setEvent(event=>2);
          setEventModal(true);
          setEventButton(false)
          break;
        case 3: 
          setRollTitle(rolltitle=>'SWAP AROUND RANDOM')
          setEvent(event=>3);
          setEventModal(true);
          setEventButton(false)
          break;
        case 4:
          setRollTitle(rolltitle=>'SWAP AROUND CHOSEN')
          setEvent(event=>4);
          setEventModal(true);
          setEventButton(false)
          break;
        case 5: 
          setRollTitle(rolltitle=>'SO MANY CHOICES!')
          setEvent(event=>5);
          setEventModal(true);
          setEventButton(false)
          break;
        case 6:
          setRollTitle(rolltitle=>'SOUL FOR A SOUL')
          setEvent(event=>6);
          setEventModal(true);
          setEventButton(false)
          break;
        case 7: 
          setRollTitle(rolltitle=>'ID BUY THAT FOR A DOLLAR')
          setEvent(event=>7);
          setEventModal(true);
          setEventButton(false)
          break;
        case 8:
          setRollTitle(rolltitle=>'BACK TO THE FUTURE')
          setEvent(event=>8);
          setEventModal(true);
          setEventButton(false)
          break;
        case 9: 
          setRollTitle(rolltitle=>'POTLUCK')
          setEvent(event=>9);
          setEventModal(true);
          setEventButton(false)
          break;
        case 10:
          setRollTitle(rolltitle=>'LEAST CARDS RANDOM JUNK')
          setEvent(event=>10);
          setEventModal(true);
          setEventButton(false)
          break;
        case 11: 
          setRollTitle(rolltitle=>'NEXT WINNER RANDOM JUNK')
          setEvent(event=>11);
          setEventModal(true);
          setEventButton(false)
          break;
        case 12:
          setRollTitle(rolltitle=>'LAST WINNER RANDOM JUNK')
          setEvent(event=>12);
          setEventModal(true);
          setEventButton(false)
          break;
        case 13: 
          setRollTitle(rolltitle=>'NOT THAT ONE')
          setEvent(event=>13);
          setEventModal(true);
          setEventButton(false)
          break;
        case 14:
          setRollTitle(rolltitle=>'GO FISH')
          setEvent(event=>14);
          setEventModal(true);
          setEventButton(false)
          break;
        case 15: 
          setRollTitle(rolltitle=>'PITY PRIZE!')
          setEvent(event=>15);
          setEventModal(true);
          setEventButton(false)
          break;
        case 16:
          setRollTitle(rolltitle=>'DUMPSTER DIVING')
          setEvent(event=>16);
          setEventModal(true);
          setEventButton(false)
          break;
        case 17: 
          setRollTitle(rolltitle=>'VOLCANO')
          setEvent(event=>17);
          setEventModal(true);
          setEventButton(false)
          break;
        case 18:
          setRollTitle(rolltitle=>'OVER CONFIDENCE')
          setEvent(event=>18);
          setEventModal(true);
          setEventButton(false)
          break;
        case 19: 
          setRollTitle(rolltitle=>'CHARITY')
          setEvent(event=>19);
          setEventModal(true);
          setEventButton(false)
          break;
        case 20:
          setRollTitle(rolltitle=>'PLAYED TOO WELL')
          setEvent(event=>20);
          setEventModal(true);
          setEventButton(false)
          break;
    }

    })


    socket.on('lockedIn', users => {
      setUsers(users)
      for (let i=0; i<users.length; i++){
        if (users[i].roundReady==true){
          setGameModal(true)
          setInstructions('');
        }
        else if (users[i].roundReady==false){
          setGameModal(false)
          setInstructions('Click to place card down');
          break;
        }
      }
      
    })


    
    socket.on("receive_message", (data) => {
      setChat(chat => [...chat, data]);
      dummy.current.scrollIntoView({behavior:'smooth'})
    });

    socket.on('placeCard', (users) => {
      setUsers(users)
    })



  }, [users]);
  return (
    <div className='App d-flex flex-column'>
      {gameModal && <GameModal users={users} socket={socket}/> }
      {trashModal && <TrashModal trash={trash}/> }
      {eventModal && <EventModal socket={socket}/>}
      <div className='firstHalf d-flex'>

        <div className='mainScreen d-flex flex-column align-items-center'>
          <div className='outerScreen '>
            <h1 className='text-center'>GAME OF GAMES</h1>
            

            <div className='innerScreen'>
              <h3 className='text-center pt-5 text-light'>{instructions}</h3>
              <div className='d-flex flex-column align-items-center'>
              <div className='cardSpots d-flex flex-row justify-content-center mt-5'>
                {users.map((user)=>(

                <div>
                  <li key={uuidv4()}>
                    <h5 className='ms-3 text-light'>{user.name} : {user.hand.length}</h5>
                    <div className='cardSpot' style={ user.roundReady ? { border:'.5rem solid red'} : {}}>
                      {user.cardPlaced!='' && <div className='mainContainer'>{user.name==userName ? <div className='theCard'><div className='down'></div><div className='up'><h3  className=' x'>{user.cardPlaced} </h3></div></div> : <div className='down'/>}</div>}

                    </div>    
                    {user.cardPlaced!='' &&
                    <div className='d-flex flex-column'>
                    <Button onClick={()=>switchCard(user.cardPlaced)} disabled={!(user.name==userName) || !(user.roundReady!=true) || (theFuture==true)} variant='primary'  className='ms-3 w-75' >
                      Switch Card
                    </Button>
                    <Button onClick={()=>socket.emit('lockIn')} disabled={!(user.name==userName) || !(user.roundReady!=true) } variant='danger'  className='ms-3 w-75' >
                      Lock In
                    </Button>

                    </div>}

                  </li>
                </div>

                ))}
                </div>

              </div>
            </div> 
          </div>  

        </div>

        <div className='eventsAndDecks d-flex flex-column'>
            <div className='diceSide d-flex flex-column align-items-center'>
                  <h2 className='text-center'>Event Roller</h2>
                  <div className='diceRoll mt-4'>
                      <h1 className='text-center pt-4'>{diceNumber}</h1>
                      
                  </div>
                  <Button className='mt-3' onClick={()=>socket.emit('rollDice')}disabled={!eventButton || winner!=userName}>ROLL DICE </Button>
                  <h4>{rollTitle}</h4>
            </div>

            <div className='trashDeckSide d-flex flex-column align-items-center'>
                  <div className='cardSpot mt-5'>
                    <div  onClick={()=>setTrashModal(true)}className='faceDown x'>

                    </div>
                    <h3 className='mt-3'>trash deck</h3>
                  </div>
            </div>
        </div>

      </div>


      <div className='secondHalf d-flex'>

        <div className=' handCards d-flex flex-column'>

        <div className='bottomCards d-flex flex-column align-items-center '>
            <h2 className='textBack text-center'>{userName}'s cards:</h2>
          </div>

          <div className='cards d-flex flex-row'> 
            {hand.map((game) => (
                  <div className='cardsInHand' >
                      <li key={uuidv4()}>
                          <h3 onClick={()=> {if(eventButton==false){setCard(game)}}}  className='faceUp faceUpHand' >{game}</h3>
                      </li>
                  </div>
          
            
        ))}
                  {hand.length==0 && 
                      <Button onClick={concede} variant={'danger'} className='w-25' >
                      CONCEDE
                    </Button>}
          </div>

          


        </div>

        <div className='chatBox d-flex flex-column'>
          <div className='chatHeader'>
            <h5 className='text-center'>Chat Log</h5>
          </div>
          <div className='chatBody'>
              {chat.map(({user, text}, index) => (
                <div key={index}>
                  <li> {user.name}: {text}</li>
                </div>
              ))}

            <div ref={dummy}></div>

          </div>
            <Form onSubmit={addChat} autoComplete="off" className='chatBottom  p-3 d-flex'>
              <Form.Group  className='w-75' controlId="textChat">
                <Form.Control type="text"  value={textChat} onChange = {(e) => setTextChat(e.target.value)}/>
              </Form.Group>
              <Button variant='primary' type='submit' className='w-25' >
                Send
              </Button>
            </Form>
          
        </div>

      </div>

    </div>
  );
}

export default App;