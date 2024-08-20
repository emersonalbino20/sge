import { combineReducers } from "redux";
import  modify  from './User/slice'
import studentUpdateSlice from "./studentUpdateSlice";

const rootReducer = combineReducers({modify, studentUpdateSlice})

export default rootReducer