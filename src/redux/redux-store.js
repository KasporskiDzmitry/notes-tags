import {applyMiddleware, combineReducers, createStore} from "redux";

import thunkMiddleware from 'redux-thunk';
import appReducer from "./app-reducer";


let reducers = combineReducers({
    appReducer: appReducer,
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;