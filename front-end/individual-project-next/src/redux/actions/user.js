
import { axiosInstance } from "../../config/api";

import user_types from "../../redux/types/user"
import { network_types } from "../types/network";


export function userLogin (values, setSubmitting)  {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
          username: values.username,
          password: values.password,
      });

      const userResponse = res.data.result
      
      localStorage.setItem("user_data", JSON.stringify({...userResponse}));
      
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