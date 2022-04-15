import user_types from "../../types/user"

const init_state = {
    id: 0,
    username: "",
    fullname: "",
    ava_pic: ""
}

const userReducer = (state = init_state, action) => {
    if(action.type === user_types.LOGIN_USER){
        return {
            ...state,
            id: action.payload.id,
            username: action.payload.username,
            fullname: action.payload.fullname,
            ava_pic: action.payload.ava_pic
        }
    }
    else if(action.type === user_types.LOGOUT_USER){
        return init_state
    }
    return state
}

export default userReducer