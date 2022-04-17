
import { axiosInstance } from "../../config/api";
import { network_types, user_types } from "../types";



export function userLogin (values, setSubmitting)  {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
          username: values.username,
          password: values.password,
      });

      const userResponse = res.data.result
      
      const userData = JSON.stringify({...userResponse})
      localStorage.setItem("user_token", userResponse.token);
      
      dispatch({
        type: user_types.LOGIN_USER,
        payload: userResponse.user,
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

export const fetchUserData = () => {
  return async (dispatch, getState) => {
    try {
      const res = await axiosInstance.get(`/users`, {
        params: {
          userId: getState().user.id,
        },
      });

      dispatch({
        type: user_types.KEEP_LOGIN,
        payload: res.data.result,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const testFn = () => {
  return 1 + 1
}