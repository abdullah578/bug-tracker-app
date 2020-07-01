import { combineReducers } from "redux";
import projectReducer from "./Projects";
import userReducer from "./Users";
import authReducer from "./auth";
import ticketReducer from "./Tickets";
import * as actionTypes from '../actions/actionTypes'


const appReducer = combineReducers({
    project: projectReducer,
    user: userReducer,
    ticket: ticketReducer,
    auth: authReducer,
  });

const rootReducer=(state,action)=>{
    if(action.type===actionTypes.AUTH_LOGOUT) state=undefined;
    return appReducer(state,action);
}

export default rootReducer