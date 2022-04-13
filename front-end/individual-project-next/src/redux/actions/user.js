
import { axiosInstance } from "../../config/api";

import { user_types, } from "../../redux/types/user"
import { network_types } from "../types/network";


export const userLogin = (values, setSubmitting) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get("/users", {
        params: {
          username: values.username,
          // password: values.password,
        },
      });

      const userResponse = res.data.result
      
      localStorage.set("user_data", userResponse.username);
      
      dispatch({
        type: user_types.LOGIN_USER,
        payload: userResponse,
      });

      setSubmitting(false)
    } catch (err) {
      console.log(err)

      dispatch({
        type: network_types.NETWORK_ERROR,
        payload: {
          title: "Login Failed",
          description: err.message
        }
      })
      setSubmitting(false)
    }
  }
}

export const testFn = () => {
  return 1 + 1
}