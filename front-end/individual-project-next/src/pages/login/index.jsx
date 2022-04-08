import {Text, Box, Input, FormControl, Button, Center, Divider, useToast, FormHelperText} from '@chakra-ui/react'
import { axiosInstance } from '../../config/api'
import {useDispatch, useSelector} from 'react-redux'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  user_types  from '../../redux/types/user'
import {useRouter} from 'next/router'
import {Navigate} from 'react-router-dom'
import Home from '..'

const LoginPage = () => {
    const userSelector = useSelector((state) => state.user)

    // Variable untuk dispatch
    const dispatch = useDispatch()

    // Variable untuk toast
    const toast = useToast()

    // Variable router
    const router = useRouter()

    // Variable untuk use formik
    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: async (values) => {
            try {
                const res = await axiosInstance.get("/my_account", {
                    params: {
                        username: values.username,
                        password: values.password
                    }
                })

                if(res.data.length){
                    dispatch({
                        type: user_types.LOGIN_USER,
                        payload: {
                            id: res.data[0].id,
                            username: res.data[0].username,
                            userId: res.data[0].id
                        }
                    })

                    localStorage.setItem("user_data", JSON.stringify({
                        id: res.data[0].id,
                        username: res.data[0].username,
                        userId: res.data[0].id})
                    )

                    router.push("/")
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                })  
            }
        },
        validationSchema: Yup.object().shape({
            username: Yup.string().required("This field is required").min(3, "Your username has 3 character or more!"),
            password: Yup.string().required("This field is required").min(3, "Your password has 3 character or more!")
        }),
        validateOnChange: true
    })

    if(userSelector.id){
        return <Home />
    }


    return (
        <Box display="flex" alignItems="center" flexDirection="column">


            <Box borderColor="blackAlpha.300" margin="10" width="md" borderWidth="thin" padding="2" borderRadius="md">

            <Text textAlign="center" fontSize="4xl" marginY="6">Connect your Account!</Text>
            
            <FormControl isInvalid={formik.errors.username}>
            <FormHelperText>{formik.errors.username}</FormHelperText>
            {/* Input Username */}
            <Input onChange={(event) => formik.setFieldValue("username", event.target.value)} mb="4" placeholder='Username' id='inputUsername' />
            </FormControl>

            <FormControl isInvalid={formik.errors.password}>
            <FormHelperText>{formik.errors.password}</FormHelperText>
            {/* Input Password */}
            <Input onChange={(event) => formik.setFieldValue("password", event.target.value)} type="password" mb="4" placeholder='Password' id='inputPassword' />
            </FormControl>

            <Center>
            <Button onClick={formik.handleSubmit}  mt="2" mb="4" width="md" colorScheme="facebook">Login</Button>
            </Center>
            <Divider />

            <Center>
            <Button marginY="4" width="md" colorScheme="green">Register</Button>
            </Center>
                
            </Box>


        </Box>
    )
}

export default LoginPage