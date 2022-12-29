import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useRef, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {gamesListState, startHandSizeState, userNameState, screenState, usersState} from './atoms.js';


function Ready({socket}) {
  const [users, setUsers] = useRecoilState(usersState);
  const [userName,setUserName]=useRecoilState(userNameState);
  const [readyC,setReady]= useState(true);
  const [change,setChange]=useState(false);
  const [gameSize, setGameSize]=useRecoilState(startHandSizeState);
  const [gamesList,setGamesList]=useRecoilState(gamesListState);

  const [screen,setScreen]=useRecoilState(screenState);
  useEffect(() =>{

    



    socket.emit("userName", userName);
    socket.emit('recieveGameSize');
    
    socket.on('getGameSize',( gameSize) => {
      setGameSize(gameSize)
    });


    

    
    socket.on("disconnected", id => {
        setUsers(users => {
          return users.filter(user => user.id !== id);
        });
      });

    socket.on('users', (userz, gc) => {
      
        setUsers(userz);
        if (gc>Math.floor((Math.floor(gamesList.length)/2)/userz.length)){
          socket.emit('reset', Math.floor((Math.floor(gamesList.length)/2)/userz.length))
        }

      });

    socket.on('ready', users => {
        setUsers(users)
        for (let i=0; i<users.length; i++){
          if (users[i].ready==true){
            setChange(true)
          }
          else if (users[i].ready==false){
            setChange(false)
            break;
          }
        }
    });

    socket.on('startGame', (userz) => {
      setUsers(userz=>userz)
      setScreen('selection')
    });

    socket.on('incStartSize', gameSizeC => {
      setGameSize(gameSizeC)
    })

    socket.on('decStartSize', gameSizeC => {
      setGameSize(gameSizeC)
    })

    socket.on('reseted', gameSizeC => {
      console.log(gameSizeC)
      setGameSize(gameSizeC)
    })

    }, []);


    const readyUp = () =>{
      setChange(true)
      setReady(!readyC);
      socket.emit('playerReady', readyC);
    }

    const gameStart = () =>{
      socket.emit('allReady', (users))
    }

  return (



    <div className='readyUp d-flex flex-column align-items-center'>
      <div className= 'gameSizeSettings d-flex flex-row'>
        <h4 className='pt-5 ms-5 text-center'>Set Hand Size:  </h4>
        <div className='arrows ms-3 pt-3'>
          {!change  && <div className='inc mt-3' onClick={()=>socket.emit('incHandSize', (users.length))}/>}
          {!change ? <h4 className='num' >{gameSize}</h4> : <h4 className='num mt-4' >{gameSize}</h4>}
          {!change && <div className='dec' onClick={()=>socket.emit('decHandSize')}/>}
        </div>
      </div>
        <h1 className='text-center mt-5'>Waiting for players to ready up</h1>
        <div className='m-5 playersList'>
        {users.map(({name, id, ready }) => (     
          <div className='d-flex m-2 justify-content-around'>
            <li key={id}> 
            <h1 >{name}: -></h1>
            </li>
            <Button disabled={!(name==userName)  } onClick={readyUp} variant={!ready ? 'primary' :  'success'} className='w-25' >
              Ready Up
            </Button>
          </div>
        ))}
        </div>
        <Button className='w-75'onClick={gameStart}disabled={!change || users.length<2}>
          Start game!
        </Button>
    </div>
  )
}

export default Ready