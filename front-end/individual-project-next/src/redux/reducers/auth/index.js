import {user_types} from "../../types"

const init_state = {
    id: 0,
    username: "",
    fullname: "",
    ava_pic: "",
    followers: 0,
    following: 0,
    posts: 0,
    biography: "",
    current_city: "",
    is_verified: 0
}

export const authReducers = (state = init_state, action) => {
    if(action.type === user_types.KEEP_LOGIN){
        return {
            ...state,
            id: action.payload.id,
            username: action.payload.username,
            fullname: action.payload.fullname,
            ava_pic: action.payload.ava_pic,
            followers: action.payload.followers,
            following: action.payload.following,
            posts: action.payload.posts,
            biography: action.payload.biography,
            current_city: action.payload.current_city,
            is_verified: action.payload.is_verified
        }
    }
    else if(action.type === user_types.LOGOUT_USER){
        return init_state
    }
    return state
}

