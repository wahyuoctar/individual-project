
import { axiosInstance } from "../../config/api";
import { network_types, user_types } from "../types";
import jsCookie from "js-cookie";



export function userLogin (values, setSubmitting)  {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
          username: values.username,
          password: values.password,
      });

      const userResponse = res.data.result
      
      jsCookie.set("user_token", userResponse.token);
      // jsCookie.set("user_data", JSON.stringify(userResponse.user));
      
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
          title: "Wrong username or password",
          description: err?.data?.message
        }
      })
      setSubmitting(false)
    }
  }
}

export function userRegister (values, setSubmitting)  {
  return async (dispatch) => {
    try {
      await axiosInstance.post("/auth/register", {
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        password: values.password,
      });
      

      setSubmitting(false)
    } catch (err) {
      console.log(err)

      dispatch({
        type: network_types.NETWORK_ERROR,
        payload: {
          title: "Use different username or email!",
          description: err?.data?.message
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