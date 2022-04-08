import PhotosCard from "../../components/PhotosCard";
import { axiosInstance } from "../../config/api";
import {useState, useEffect} from 'react'
import {useToast, Container} from '@chakra-ui/react'

const HomePage = () => {
    const [contentList, setContentList] = useState([])
    
    const toast = useToast()
    
    const fetchContentList = async () => {
            try {
                const res = await axiosInstance.get(`/posts`, {
                    params: {
                        _expand: "user"
                    }
                })
                setContentList(res.data.result)
                
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

// Untuk render content
const renderContentList = () => {
    return contentList.map((val) =>{
        return (
        <Container maxW="5xl" shadow="lg" marginTop="10">
            
        <PhotosCard
        fullName = {val?.user?.fullname || "Fullname"}
        avaPic = {val?.user?.ava_pic}
        caption = {val?.caption}
        likes = {val?.likes}
        location = {val?.location}
        imageUrl = {val?.image_url}
        id = {val?.id}
        userId = {val?.user?.userId}
        />
        </Container>
    )})
    }

    useEffect(() => {
        fetchContentList()
    }, [])
    
    return (
        <>
        {renderContentList()}
        </>
       
      )
    }


export default HomePage