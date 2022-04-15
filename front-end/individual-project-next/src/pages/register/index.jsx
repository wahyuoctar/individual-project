import { Box, Button, FormControl, FormHelperText, FormLabel, Icon, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'
import { axiosInstance } from '../../config/api'
import { IoMdEye, IoMdEyeOff} from 'react-icons/io'

const RegistrationPage = () => {
    const toast = useToast()
    const router = useRouter()
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false)


    const registerBtnHandler = async () => {
        const newUserData = {
            fullname: formik.values.fullname,
            username: formik.values.username,
            password: formik.values.password,
            email: formik.values.email
        }
    }

    // Menghandle inputan tanpa useState
    const formik = useFormik({
        initialValues: {
            fullname: "",
            username: "",
            password: "",
            repeatPassword: "",
            email: ""
        },
        onSubmit: async (values) => {
            try {
                await axiosInstance.post("/auth/register", {
                        fullname: values.fullname,
                        username: values.username,
                        email: values.email,
                        password: values.password
                })

                router.push("/")
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
            fullname: Yup.string().required("This field is required"),
            username: Yup.string().required("This field is required").min(3, "Your username has to be at least 3 characters"),
            password: Yup.string().required("This field is required").min(8, "Weak Password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Must Contain 8 Characters, One Uppercase, One Number and One Symbol"),
            repeatPassword: Yup.string().required("This field is required").oneOf([Yup.ref("password"), null], "Password Must Match"),
            email: Yup.string().required("This field is required").email("Please use a valid email"),
        })
    })

    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <Text fontSize="2xl" mb="4">Welcome, please register your account first!</Text>
            <Box width="md">
                <form>

                <FormControl isInvalid={formik.errors.fullname}>
                <FormLabel htmlFor='inputFullname'>Fullname</FormLabel>
                <FormHelperText>{formik.errors.fullname}</FormHelperText>
                <Input onChange={(event) => formik.setFieldValue("fullname", event.target.value)} mb="3" id="inputFullname" value={formik.values.fullname}/>
                </FormControl>

                <FormControl isInvalid={formik.errors.username}>
                <FormLabel htmlFor='inputUsername'>Username</FormLabel>
                <FormHelperText>{formik.errors.username}</FormHelperText>
                <Input onChange={(event) => formik.setFieldValue("username", event.target.value)} mb="3" id="inputUsername" value={formik.values.username}/>
                </FormControl>

                <FormControl isInvalid={formik.errors.email}>
                <FormLabel htmlFor='inputEmail'>Email</FormLabel>
                <FormHelperText>{formik.errors.email}</FormHelperText>
                <Input type="email" onChange={(event) => formik.setFieldValue("email", event.target.value)} id='inputEmail' value={formik.values.email} />
                </FormControl>

                <FormControl isInvalid={formik.errors.password}>
                <FormLabel htmlFor='inputPassword'>Password</FormLabel>
                <FormHelperText>{formik.errors.password}</FormHelperText>
                <InputGroup>
                <Input type={visiblePassword ? "text": "password"} onChange={(event) => formik.setFieldValue("password", event.target.value)} id='inputPassword' value={formik.values.password} />
                <InputRightElement children={<Icon onClick={() => setVisiblePassword(!visiblePassword)} as={visiblePassword ? IoMdEye : IoMdEyeOff} sx={{ _hover: { cursor: "pointer" } }}/>} />
                </InputGroup>
                </FormControl>

                <FormControl isInvalid={formik.errors.repeatPassword}>
                <FormLabel htmlFor='inputRepeatPassword'>Repeat Password</FormLabel>
                <FormHelperText>{formik.errors.repeatPassword}</FormHelperText>
                <InputGroup>
                <Input type={visibleRepeatPassword? "text" : "password"} onChange={(event) => formik.setFieldValue("repeatPassword", event.target.value)} id='inputRepeatPassword' value={formik.values.repeatPassword} />
                <InputRightElement children={<Icon onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)} as={visibleRepeatPassword ? IoMdEye : IoMdEyeOff} sx={{ _hover: { cursor: "pointer" } }}/>} />
                </InputGroup>
                </FormControl>

                <Button type='submit' width="md" onClick={formik.handleSubmit} mt="2" colorScheme="green">
                    Register
                </Button>

                </form>
            </Box>
        </Box>
    )
}

export default RegistrationPage