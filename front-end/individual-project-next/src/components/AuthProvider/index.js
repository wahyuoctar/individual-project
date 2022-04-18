import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {user_types} from '../../redux/types/user'


const AuthProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem("user_token")
        const savedUserData = localStorage.getItem("user_data")
        
        if (token) {
            const parsedUserData = JSON.parse(savedUserData)

            dispatch({
                type: user_types.LOGIN_USER,
                payload: parsedUserData
            })
        }

        setIsLogin(true)
    }, [])

    if (!setIsLogin){
        return <h2>Kunaon ieu...?</h2>
    }

    return children
}

export default AuthProvider