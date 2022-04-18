import PhotosCard from "../components/PhotosCard";
import { axiosInstance } from "../config/api";
import {useState, useEffect} from 'react'
import {useToast, Container, Spinner, Center, Text, Box} from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroll-component'

const HomePage = () => {
    
    const [contentList, setContentList] = useState([])
    const [page, setPage] = useState(1)
    
    const toast = useToast()

    const limitPage = 3
    
    const fetchContentList = async () => {
            try {
                const res = await axiosInstance.get(`/posts`, {
                    params: {
                        _limit: limitPage,
                        _page: page
                    }
                })
                setContentList((prevPosts) => [...prevPosts ,...res.data.result])
                
            } catch (error) {
                toast({
                    title: "Can't Reach The Server",
                    description: "Connect The Server",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                  });
                }
    }

    const fetchNextPage = () => {
        setPage(page + 1)
    }

    // Untuk render content
    const renderContentList = () => {
    return contentList.map((val) =>{
        return (
        
            
        <PhotosCard
        fullName = {val?.User?.fullname || "Fullname"}
        avaPic = {val?.User?.ava_pic}
        caption = {val?.caption}
        likes = {val?.like_count}
        location = {val?.location}
        imageUrl = {val?.image_url}
        id = {val?.id}
        postDate={val?.createdAt}
        />
       
    )})
    }

    useEffect(() => {
        fetchContentList()
    }, [page])
    
    return (
        <InfiniteScroll
        dataLength={contentList.length}
        next={fetchNextPage}
        hasMore={true}
        loader={
            <Center>
                <Box width="2xs">
                    <Center>
                    <Spinner />
                    </Center>
                    <Text textAlign={"center"}>Loading...</Text>
                </Box>
            </Center>}
        endMessage={
            <h4>End of Post</h4>
        }
        onScroll={false}
        >
        <Container borderRadius="md" maxW="5xl" shadow="dark-lg" marginTop="10">
        {renderContentList()}
        </Container>
        </InfiniteScroll>
       
      )
    }


export default HomePage