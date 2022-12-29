import {atom} from 'recoil';



export const screenState=atom({
    key:'screenState',
    default:'welcome',
});

export const userNameState=atom({
    key:'userNameState',
    default:'',
});

export const usersState=atom({
    key:'usersState',
    default:[],
});

export const gamesListState=atom({
    key:'gamesListState',
    default:[],
})

export const modalState=atom({
    key:'modalState',
    default:false,
})

export const trashState=atom({
    key:'trashState',
    default:[],
})

export const trashModalState=atom({
    key:'trashModalState',
    default:true,
})



export const startHandSizeState=atom({
    key:'startHandSizeState',
    default:1,
})

export const gameModalState=atom({
    key:'gameModalState',
    default:false,
})

export const eventButtonState=atom({
    key:'eventButtonState',
    default:false,
})

export const eventModalState=atom({
    key:'eventModalState',
    default:false,
})

export const eventState=atom({
    key:'eventState',
    default:0,
})

export const handState=atom({
    key:'handState',
    default:[],
})

export const winnerState=atom({
    key:'winnerState',
    default:null,
})

export const playerNextWinState=atom({
    key:'playerNextWinState',
    default:false,
})

export const overConfidenceState=atom({
    key:'overConfidenceState',
    default:'',
})

export const loserState=atom({
    key:'loserState',
    default:'',
})

export const notThatOneState=atom({
    key:'notThatOneState',
    default:false,
})

export const futureState=atom({
    key:'futureState',
    default:false,
})

export const theFutureState=atom({
    key:'theFutureState',
    default:false,
})


export const manyChoicesState=atom({
    key:'manyChoicesState',
    default:false,
})

export const potluckState=atom({
    key:'potluckState',
    default:false,
})

export const pityPrizeState=atom({
    key:'pityPrizeState',
    default:false,
})

export const leastCardsPlayerState=atom({
    key:'leastCardsPlayerState',
    default:[],
})





