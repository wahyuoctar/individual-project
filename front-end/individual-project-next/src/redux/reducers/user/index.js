import user_types from "../../types/user"

const init_state = {
    id: 0,
    userId: 0,
    username: ""
}

const userReducer = (state = init_state, action) => {
    if(action.type === user_types.LOGIN_USER){
        return {
            ...state,
            id: action.payload.id,
            userId: action.payload.userId,
            username: action.payload.username
        }
    }
    else if(action.type === user_types.LOGOUT_USER){
        return init_state
    }
    return state
}

export default userReducer