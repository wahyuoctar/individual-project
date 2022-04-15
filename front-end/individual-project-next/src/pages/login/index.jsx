import {InputRightElement, Icon, Text, Box, Input, FormControl, Button, Center, Divider, useToast, FormHelperText, InputGroup} from '@chakra-ui/react'
import { axiosInstance } from '../../config/api'
import {useDispatch, useSelector} from 'react-redux'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  user_types  from '../../redux/types/user'
import {useRouter} from 'next/router'
import Home from '..'
import { useEffect, useState } from 'react'
import { IoMdEye, IoMdEyeOff} from 'react-icons/io'


const LoginPage = () => {
    const userSelector = useSelector((state) => state.user)
    const [visiblePassword, setVisiblePassword] = useState(false)

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
                const res = await axiosInstance.post("/auth/login", {
                        username: values.username,
                        password: values.password
                })

                if(res.data){
                    dispatch({
                        type: user_types.LOGIN_USER,
                        payload: res.data.result
                    })

                    localStorage.setItem("user_data", JSON.stringify({...res.data.result}))

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

    useEffect(() =>{
        
        if(userSelector.id){
           router.push("/")
        } 
    },[])


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
            <InputGroup>
            <Input onChange={(event) => formik.setFieldValue("password", event.target.value)} type={visiblePassword ? "text" : "password"} mb="4" placeholder='Password' id='inputPassword' />
            <InputRightElement children={<Icon onClick={() => setVisiblePassword(!visiblePassword)} as={visiblePassword ? IoMdEye : IoMdEyeOff} sx={{ _hover: { cursor: "pointer" } }}/>} />
            </InputGroup>
            </FormControl>

            <Center>
            <Button onClick={formik.handleSubmit}  mt="2" mb="4" width="md" colorScheme="facebook">Login</Button>
            </Center>
            <Divider />

            <Center>
            <Button onClick={() => router.push("/register")} marginY="4" width="md" colorScheme="green">Register</Button>
            </Center>
                
            </Box>


        </Box>
    )
}

export default LoginPage