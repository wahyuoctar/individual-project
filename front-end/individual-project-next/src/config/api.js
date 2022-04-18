import axios from 'axios'
import {user_types, network_types} from '../redux/types'
import store from '../redux/store'

export const axiosInstance = axios.create({
    baseURL: "http://localhost:2000"
})

axiosInstance.interceptors.request.use((config) => {
    // config.headers.token = "testing123"
    config.headers.authorization = localStorage.getItem("user_token") || ""
  
    return config
  })
  
  axiosInstance.interceptors.response.use(
    (res) => {
      return res
    },
    (err) => {
      if (err.response.status == 419) {
        localStorage.removeItem("user_token")
  
        store.dispatch({
          type: user_types.LOGOUT_USER
        })
      }
  
      store.dispatch({
        type: network_types.NETWORK_ERROR,
        payload: {
          title: "Network Error",
          description: err.response.data.message
        }
      })
  
      return err
    }
  )