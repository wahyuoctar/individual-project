import {Box, Avatar, Text, Image, Stack, Container, Flex, SimpleGrid, Divider, Link as ChakraLink} from '@chakra-ui/react'
import NextLink from 'next/link'

const PhotosCard = ({imageUrl, avaPic, location, fullName, id, likes, caption}) => {
    return (
        // <Container maxW="5xl" shadow="lg" marginTop="10">
        <Flex>
        <Box flex={65}>
        <Stack>
            <NextLink href={`/photos/${id}`}>
            <ChakraLink>
            <Image width="100%" src={imageUrl} />
            </ChakraLink>
            </NextLink>
            
        </Stack>
        </Box>

        <Box flex={35}>
        <Flex marginLeft="6" marginTop="2">
            <Box display="flex" flexDirection="column"> 
            <Box mb="3" paddingX="2" display="flex" alignItems="center">
            <Avatar src={avaPic}/>
            <Box marginLeft="2">
            <Text className="username" fontWeight="bold">{fullName}</Text>
            <Text color="gray">{location}</Text>
            </Box>
            </Box>
            <Divider />
            <Text fontWeight="bold">{likes?.toLocaleString()} likes</Text>
            <Text>{caption}</Text>
            </Box>
        </Flex>
        </Box>



        </Flex>
        // </Container>

        
    )
}

export default PhotosCard