import {combineReducers} from 'redux'
import { authReducers } from './reducers/auth'
import {userReducer} from './reducers/user'
 

const rootReducer = combineReducers({
    user: userReducer,
    auth: authReducers
})

export default rootReducer