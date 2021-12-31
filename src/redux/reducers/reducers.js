import { ActionTypes } from "../actions/action-types";

const initialState={
    filter:{
        filter:"locations",
        inputdata:""
    }
}

const filterReducer=(state=initialState,action)=>{
    switch(action.type){
        case ActionTypes.SET_FILTER: return{
            filter:state.filter,
            filter:action.payload
        }
        case ActionTypes.SET_INPUTDATA: return{
            inputdata:state.inputdata,
            inputdata:action.payload,
        }
        default: return state
    }
}

export default filterReducer;