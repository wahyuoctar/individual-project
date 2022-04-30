import {combineReducers, createStore, applyMiddleware} from 'redux'
import { authReducers, networkReducer, userReducer } from './reducers'

import thunk from 'redux-thunk'
 

const rootReducer = combineReducers({
    user: userReducer,
    auth: authReducers,
    network: networkReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk));


export default store