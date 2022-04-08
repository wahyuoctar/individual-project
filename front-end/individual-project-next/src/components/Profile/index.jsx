import {Avatar, Box, Container, Text, Divider, Input, Button, Flex} from '@chakra-ui/react'
import { axiosInstance } from '../../config/api'
import PhotosCard from '../PhotosCard'

const Profile = ({fullname, currentCity, posting, followers, following, biography}) => {
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
                <Flex>
                <Input placeholder='Caption...'/>
                </Flex>


                <Flex my="2" justifyContent="space-between">
                    <Input  placeholder='Image URL' width="xs" />
                    <Button width="3xs" colorScheme="green">Post</Button>
                </Flex>

            </Box>
       
        </Box>
        </Container>
    )
}

export default Profile
