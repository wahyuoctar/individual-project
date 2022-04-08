import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Text } from '@chakra-ui/react'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import * as Yup from 'yup'

const RegistrationPage = () => {
    const router = useRouter()

    const registerBtnHandler = async () => {
        const newUserData = {
            username: formik.values.username,
            password: formik.values.password,
            email: formik.values.email
        }
    }

    // Menghandle inputan tanpa useState
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: ""
        },
        onSubmit: (values) => {
            formik.setFieldValue("username", "")
            console.log(values);
        },
        validationSchema: Yup.object().shape({
            username: Yup.string().required("This field is required").min(3, "Your username has to be at least 3 characters"),
            password: Yup.string().required("This field is required").min(8, "Your password needs at least 8 characters"),
            email: Yup.string().required("This field is required").email("Please use a valid email"),
        }),
        validateOnChange: false
    })

    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <Text fontSize="2xl" mb="4">Welcome, please login</Text>
            <Box width="md">
                <form>

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
                <Input type="password" onChange={(event) => formik.setFieldValue("password", event.target.value)} id='inputPassword' value={formik.values.password} />
                </FormControl>

                <Button type='submit' onClick={formik.handleSubmit} mt="2" colorScheme="teal">
                    Login
                </Button>

                </form>
            </Box>
        </Box>
    )
}

export default RegistrationPage