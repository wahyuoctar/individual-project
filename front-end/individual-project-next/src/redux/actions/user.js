
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

      if (!res.data.length) {
        throw new Error("User not found");
      }

      if (res.data[0].password !== values.password) {
        throw new Error("Wrong password");
      }

      const userData = res.data[0];
      const stringifiedUserData = JSON.stringify(userData);

      localStorage.set("user_data", stringifiedUserData);

      dispatch({
        type: user_types.LOGIN_USER,
        payload: userData,
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