import {Avatar, Box, Container, Text, Divider, Input, Button, Flex, useToast} from '@chakra-ui/react'
import { axiosInstance } from '../../config/api'
import {useRef, useState} from 'react'
import {useFormik} from 'formik'

const Profile = ({fullname, currentCity, posting, followers, following, biography}) => {

    const toast = useToast()
    const formik = useFormik({
        initialValues: {
            caption: "",
            location: ""
        },

    })

    const [selectedFile, setSelectedFile] = useState(null)

    const inputFile = useRef(null)

    const handleFile = (event) => {
        setSelectedFile(event.target.files[0])
        alert(event.target.files[0].name)
    }

    const uploadHandler = async () => {
        if (!selectedFile) {
            alert("Select your Image First!")
            return
        }
        const user = JSON.parse(localStorage.getItem("user_data"))
        
        const formData = new FormData()
        const {caption, location} = formik.values
    
        formData.append("caption", caption)
        formData.append("location", location)
        formData.append("user_id", user.id)
        formData.append("image_url", selectedFile)
    
        try {
            await axiosInstance.post("/posts", formData)
            setSelectedFile(null)
            formik.setFieldValue("caption", "")
            formik.setFieldValue("location", "")
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <Container minW="xl" shadow="lg" marginTop="10">
        <Box alignItems="center" display="flex" flexDirection="column">
            <Avatar size="xl" />
            <Text mt="2" fontSize="xl" fontWeight="bold">{fullname}</Text>
            <Text fontSize="sm" color="gray.500">{currentCity}</Text>
            
            <Box display="flex" mt="3">

                {/* Box for posts */}
                <Box marginLeft="7">
                <Text textAlign={"center"} fontWeight="bold">{posting}</Text>
                <Text color="gray">Posts</Text>
                </Box>

                {/* Box for followers */}
                <Box marginLeft="7">
                <Text textAlign={"center"} fontWeight="bold">{followers}</Text>
                <Text color="gray">Followers</Text>
                </Box>

                {/* Box for following */}
                <Box marginLeft="7">
                <Text textAlign={"center"} fontWeight="bold">{following}</Text>
                <Text color="gray">Following</Text>
                </Box>

            </Box>

            <Text textAlign="center">{biography}</Text>
            <Divider />

            <Box padding="2"  my="4" width="xl" borderRadius="md">
                <Text textShadow='1px 1px #ff0000' as="h3" fontWeight="bold">Please share your moment here!</Text>
                <Input onChange={(event) => formik.setFieldValue("caption", event.target.value)} placeholder='Caption...'/>
                <Input onChange={(event) => formik.setFieldValue("location", event.target.value)} mt={"2"} placeholder='Location...'/>

                <Flex my="2" justifyContent="space-between">
                    <Input accept="image/png, image/jpeg, image/jpg" onChange={handleFile} ref={inputFile} type="file" display="none" />
                    <Button onClick={() => inputFile.current.click()} width="50%" mr="1" colorScheme="facebook">Upload File</Button>
                    <Button onClick={uploadHandler} width="50%" colorScheme="green">Post</Button>
                </Flex>

            </Box>
       
        </Box>
        </Container>
    )
}

export default Profile
