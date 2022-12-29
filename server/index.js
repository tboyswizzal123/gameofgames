const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {

    cors:{
        origin:"https://gameofgames.netlify.app:443", 
        methods: ["GET", "POST"],
    },
});
const users=[];
const gameList=[];

var trash=[];
var gameSize=1;




io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    io.emit('startScreen', gameList)

    socket.on("userName", (userName) => {
        const user={
            name:userName,
            id:socket.id,
            ready:false,
            hand:[],
            handSize:0,
            cardPlaced:'',
            roundReady:false,
            flipped:false,
            backToFuture:'',
            soManyChoices:'',
        };
        users[socket.id]=user;
        
        io.emit("users", Object.values(users),gameSize);
    });


    socket.on('lockIn', ()=>{
        users[socket.id].roundReady=true;
        io.emit("lockedIn", Object.values(users));
    })

    socket.on('swapCard', (cardPlaced) =>{
        users[socket.id].hand.push(cardPlaced);
        users[socket.id].cardPlaced='';
        io.emit("placeCard", Object.values(users));
        
    })

    socket.on('flipCard', (shuffled, name) =>{
        for (let i=0; i<shuffled.length; i++){
            if(shuffled[i].name==name){
                shuffled[i].flipped=true;
            }   
        }
        io.emit("flippedCard", Object.values(shuffled));
    })

    socket.on('notThatCard', (shuffled, name, game) =>{
        for (let i=0; i<shuffled.length; i++){
            if(shuffled[i].name==name){
                users[shuffled[i].id].hand.push(game)
                shuffled.splice(i,1)
                
            }   
        }
        io.emit("notThatOneDone", {shuff:Object.values(shuffled), users:Object.values(users)});
    })

    socket.on('flipGarbage', (shuffled, game) =>{
        for (let i=0; i<shuffled.length; i++){
            if(shuffled[i].name==game){
                shuffled[i].flipped=true;
                for (let x=0; x<trash.length;x++){
                    if (shuffled[i].name==trash[x]){
                        trash.splice(x,1);
                    }
                }
            }   
        }
        io.emit("flippedGarbage", Object.values(shuffled), trash);
    })

    socket.on('takeGarbage', (shuffled,game,name) => {
        users[socket.id].hand.push(game);



        for (let i=0;   i<trash.length; i++){
            if(trash[i]==game){
                trash.splice(i,1);
               
            }
        }


        io.emit('tookGarbage',{users: Object.values(users), trash:trash, winner:name})
    })

    socket.on('takeCard', (shuffled,game, name) => {
        users[socket.id].hand.push(game);



        for (let i=0;   i<shuffled.length; i++){
            if(shuffled[i].flipped!=true){
                if(shuffled[i].cardPlaced!=game){
                    trash.push(shuffled[i].cardPlaced);
                }
               
            }
        }


        io.emit('tookCard',{users: Object.values(users), trash:trash, winner:name})
    })

    socket.on('takeCard&random', (userz, shuffled,game, name) => {
        users[socket.id].hand.push(game);
        var taken=[]


        for (let x=0; x<userz.length; x++){
            for (let i=0; i<shuffled.length; i++){
                if(shuffled[i].flipped!=true){
                    if(shuffled[i].cardPlaced!=game){
                        if(!taken.includes(shuffled[i].cardPlaced)){
                            users[userz[x].id].hand.push(shuffled[i].cardPlaced);
                            taken.push(shuffled[i].cardPlaced)
                            break;
                        }

                    }
                   
                }

            }
        }

        for (let z=0; z<shuffled.length;z++){
            if(shuffled[z].flipped!=true){
                if(shuffled[z].cardPlaced!=game){
                    if(!taken.includes(shuffled[z].cardPlaced)){
                        trash.push(shuffled[z].cardPlaced);
                        break;
                    }

                }
               
            }
        }



        io.emit('tookCard',{users: Object.values(users), trash:trash, winner:name})
    })


    socket.on('potfuck', (info) => {
        users[socket.id].hand.push(info.game);
        var taken=[]


        for (let x=0; x<info.userz.length; x++){
            if(info.userz[x].name!=info.name){
            for (let i=0; i<info.shuffled.length; i++){
                if(info.shuffled[i].flipped!=true){
                    if(info.shuffled[i].cardPlaced!=info.game){
                        if(!taken.includes(info.shuffled[i].cardPlaced)){
                            users[info.userz[x].id].hand.push(info.shuffled[i].cardPlaced);
                            taken.push(info.shuffled[i].cardPlaced)
                            break;
                        }

                    }
                   
                }

            }
        }
        }

        for (let z=0; z<info.shuffled.length;z++){
            if(info.shuffled[z].flipped!=true){
                if(info.shuffled[z].cardPlaced!=info.game){
                    if(!taken.includes(info.shuffled[z].cardPlaced)){
                        trash.push(info.shuffled[z].cardPlaced);
                        break;
                    }

                }
               
            }
        }



        io.emit('tookCard',{users: Object.values(users), trash:trash, winner:info.name})
    })

    

    socket.on('takeCardLoser', (shuffled,game, name,loser) => {
        users[socket.id].hand.push(game);



        for (let i=0;   i<shuffled.length; i++){
            if(shuffled[i].flipped!=true){
                if(shuffled[i].cardPlaced!=game){

                    users[loser].hand.push(shuffled[i].cardPlaced);
                }
               
            }
        }


        io.emit('loserTookCard',{users: Object.values(users), winner:name})
    })

    socket.on('setLoser', () =>{
        let name=users[socket.id].id
        io.emit('loserSet', (name));
    })

    socket.on('takeTwoCards', (info) => {
        users[socket.id].hand.push(info.game);



        for (let i=0; i<info.shuffled.length; i++){
            if(info.shuffled[i].flipped!=true){
                if(info.shuffled[i].cardPlaced==info.game){
                    info.shuffled.splice(i,1);
                }
               
            }
        }


        io.emit('tookTwo',{users: Object.values(users), shuffle:info.shuffled})
    })


    socket.on('clearPlaced', ()=>{
        users[socket.id].cardPlaced=''
        users[socket.id].roundReady=false;
        io.emit('clearEverything', Object.values(users))
    })

    socket.on('inTheFuture', ()=>{
        users[socket.id].cardPlaced=users[socket.id].backToFuture;
        users[socket.id].backToFuture='';

        io.emit('clearEverything', Object.values(users))
    })


    socket.on('sendCard',(game) => {
        for (let i=0; i<users[socket.id].hand.length; i++){
            if(users[socket.id].hand[i]==game){
                users[socket.id].hand.splice(i,1);
            }
        }
        users[socket.id].cardPlaced=game;
        io.emit('placeCard', Object.values(users));
    });

    socket.on('selectCard', (game, keepOrDiscard) => {
        if (keepOrDiscard=='keep'){
            users[socket.id].hand.push(game);
            users[socket.id].handSize++;
        }
        if (keepOrDiscard=='discard'){
            trash.push(game);
        }

        io.emit("addToHand", {users: Object.values(users), trash:trash, trashCount:trash.length, game:game});
    });

    socket.on('shuffle', users =>{
        const newUsers = [...users].sort(() => Math.random() - 0.5);
        io.emit('shuffled',Object.values(newUsers));
    })

    socket.on('shuffleConfidence', (info) =>{
        
        var newUsers = [...info.users].sort(() => Math.random() - 0.5);
        newUsers.push({name:'temp',cardPlaced:info.game, flipped:false})
        newUsers=[...newUsers].sort(() => Math.random() - 0.5);
        io.emit('shuffled',Object.values(newUsers));
    })

    socket.on('shuffleAllChoices', userz =>{
        var newUsers = [...userz].sort(() => Math.random() - 0.5);
        for (let i=0; i<userz.length; i++){
            newUsers.push({name:i,cardPlaced:userz[i].soManyChoices, flipped:false})
        }
        
        newUsers=[...newUsers].sort(() => Math.random() - 0.5);
        io.emit('shuffled',Object.values(newUsers));
    })

    socket.on('addPotLuck', (info) =>{
        var newUsers = [...info.shuffled].sort(() => Math.random() - 0.5);
        newUsers.push({name:info.game,cardPlaced:info.game, flipped:false})
        for (let i=0; i<users[socket.id].hand.length; i++){
            if(users[socket.id].hand[i]==info.game){
                users[socket.id].hand.splice(i,1);
            }
        }
        
        newUsers=[...newUsers].sort(() => Math.random() - 0.5);
        io.emit('shuffledP',{newUsers:Object.values(newUsers), users:Object.values(users)});
    })

    socket.on('shuffleTrash', () =>{
        let trashy=[]
        const newTrash = [...trash].sort(() => Math.random() - 0.5);
        let selected = newTrash.slice(0, 3);
        for (let i=0; i<selected.length;i++){
            trashy[i]={name:selected[i], flipped:false}
        }

        io.emit('shuffledTrash',Object.values(trashy));
    })

    socket.on('playerReady', (ready)=> {
        users[socket.id].ready=ready;
        io.emit("ready", Object.values(users));
    })

    socket.on("send_message", (data) => {
        io.emit("receive_message", {
            text:data,
            user:users[socket.id]});
    });

    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        if(users.length==0){
            trash=[]
        }
        io.emit("disconnected", socket.id);
      });

    socket.on("allReady", (userz) => {
        for (let i=0; i<userz.length;i++){
            users[userz[i].id].ready=false
        }
        io.emit("startGame", (users))
    });

    socket.on('FullStart', () =>{
        io.emit('fullStartGame')
    })

    socket.on('addGame', (gameName) =>{
        gameList.push(gameName);
        io.emit("newGameList", gameList);
    })

    socket.on('incHandSize', (userLen) => {


        if (gameSize< Math.floor(Math.floor(gameList.length/2)/userLen)){
            gameSize=gameSize+1;

        }
        io.emit('incStartSize',gameSize);
    })

    socket.on('decHandSize', () => {
        if(gameSize>1){
            gameSize=gameSize-1;
        }
        

        io.emit('decStartSize',gameSize);
    })

    socket.on('reset', (newGZ) =>{
        gameSize=newGZ;
        io.emit('reseted',gameSize);
    })

    socket.on('recieveGameSize', () => {
        io.emit('getGameSize',gameSize);
    })

    socket.on('deleteGame', (gameName) =>{
        for (let i=0; i<gameList.length; i++){
            if(gameList[i]==gameName){
                gameList.splice(i,1);

            }
        }
        io.emit('newGameList', gameList)
    })


    socket.on('rollDice', (diceNumber) =>{
        var diceRolled=(1 + Math.floor(Math.random() * 20));
        io.emit('diceRolled', diceRolled);
    })

    socket.on('discardRandom', ()=>{
        var rando=(Math.floor(Math.random() * users[socket.id].hand.length))
        trash.push(users[socket.id].hand[rando])
        users[socket.id].hand.splice(rando,1);
        io.emit('randomDiscarded',{users:Object.values(users), trash: trash})
    })

    socket.on('discardChosen', (game)=>{
        for (let i=0; i<users[socket.id].hand.length; i++){
            if(users[socket.id].hand[i]==game){
                trash.push(game)
                users[socket.id].hand.splice(i,1);
            }
        }
        io.emit('chosenDiscarded', {users:Object.values(users), trash: trash})
    })

    socket.on('swapRandom', (data)=>{
        console.log(data.tempHand)
        var rando=(Math.floor(Math.random() * data.tempHand.length))
        var game = data.tempHand[rando]
        users[data.swappedID].hand.push(game)
        users[socket.id].hand.splice(rando,1);
        
        io.emit('randomSwapped', Object.values(users))
    })

    socket.on('swapChosen', (data)=>{
        for (let i=0; i<data.tempHand.length; i++){
            if(data.tempHand[i]==data.game){
                users[data.swappedID].hand.push(data.game)
                users[socket.id].hand.splice(i,1);
            }
        }
        io.emit('chosenSwapped', Object.values(users))
    })

    socket.on('getLeastCardedPlayer', (usas)=>{
        var leastCards=100;
        var leastCardsPlayers=[];
        for (let i=0; i<usas.length; i++){
            if(usas[i].hand.length==leastCards){
                leastCardsPlayers.push(usas[i].name)
            }
            if(usas[i].hand.length<leastCards){
                leastCards=usas[i].hand.length
                leastCardsPlayers=[usas[i].name]
            }

        
        }
        socket.emit('giveLeastCardedPlayer', leastCardsPlayers)

    })

    socket.on('gainRandomTrash', ()=>{
        var rando=(Math.floor(Math.random() * trash.length)) 
        users[socket.id].hand.push(trash[rando]);
        trash.splice(rando,1)
        io.emit('randomTrashGained', {users:Object.values(users), trash:trash})
    })

    socket.on('backToFuture', (game) =>{
        users[socket.id].backToFuture=game;
        for (let i=0;i<users[socket.id].hand.length; i++){
            if(game==users[socket.id].hand[i]){
                users[socket.id].hand.splice(i,1);
            }
            
        }
        io.emit('toTheFuture', (Object.values(users)))
    })

    socket.on('soManyChoices', (game) =>{
        users[socket.id].soManyChoices=game;
        for (let i=0;i<users[socket.id].hand.length; i++){
            if(game==users[socket.id].hand[i]){
                users[socket.id].hand.splice(i,1);
            }
            
        }
        io.emit('allTheChoices', (Object.values(users)))
    })

    socket.on('takePlayerCard', (info) =>{
        users[socket.id].hand.push(info.game);
        for (let i=0;i<users[info.id].hand.length; i++){
            if(info.game==users[info.id].hand[i]){
                users[info.id].hand.splice(i,1);
            }
            
        }

        io.emit('playerCardTook', (Object.values(users)))
        
    })

    socket.on('gainRandomTrashTwo', ()=>{
        var rando=(Math.floor(Math.random() * trash.length)) 
        users[socket.id].hand.push(trash[rando]);
        trash.splice(rando,1)
        io.emit('randomTrashGainedTwo', {users:Object.values(users), trash:trash})
    })

    socket.on('nextWinnerGainRandomTrash', ()=>{
        var nextWin=true;
        io.emit('nextWin', nextWin)
    })

    socket.on('pushGarbage', (game)=>{
        users[socket.id].hand.push(game)
        for (let i=0; i<trash.length; i++){
            if(trash[i]==game){
                trash.splice(i,1)
            }
        }
        io.emit('pushedGarbage', {users:Object.values(users), trash:trash})
    })

    socket.on('overConfidence', (game)=>{
        for (let i=0; i<users[socket.id].hand.length;i++){
            if (users[socket.id].hand[i]==game){
                users[socket.id].hand.splice(i,1)
            }
        }
        io.emit('overconfident', {game:game, users:Object.values(users)})
    })

    socket.on('charity', (info)=>{
        for (let i=0; i<users[socket.id].hand.length; i++){
            if(users[socket.id].hand[i]==info.game){
                users[info.id].hand.push(users[socket.id].hand[i])
                users[socket.id].hand.splice(i,1);
            }
        }
        io.emit('charityEnd', Object.values(users))
    })

    socket.on('playedTooWell', (info)=>{
        var rando=(Math.floor(Math.random() * info.hand.length)) 
        users[info.id].hand.push(users[socket.id].hand[rando])
        users[socket.id].hand.splice(rando,1)
        io.emit('playedTooWellFinish', Object.values(users))
    })

    socket.on('setLeastRandomPlayer', (random)=>{
        io.emit('setLeastRandomPlayerFinish',(random));
    })

    socket.on('gameOver', ()=>{
        trash=[]
        io.emit('finishScreen',trash);
    })



});

server.listen(3001, () => {

});