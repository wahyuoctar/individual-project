import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {user_types} from '../../redux/types/user'
import jsCookie from "js-cookie";
import { axiosInstance } from '../../config/api';


const AuthProvider = ({children}) => {

    const dispatch = useDispatch()

    useEffect(async () => {
        const userToken = jsCookie.get("user_token")

        
        if (userToken) {
            try {
                const res = await axiosInstance.get("/auth/update-token")
                jsCookie.set("user_token", res?.data?.result?.token || "")

                dispatch({
                    type: user_types.LOGIN_USER,
                    payload: res.data.result.user
                })

                dispatch({
                    type: user_types.KEEP_LOGIN,
                    payload: res.data.result.user
                })
            } catch (err) {
                console.log(err);
            }

        }
    }, [])

    return children
}

export default AuthProvider