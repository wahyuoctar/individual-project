import {Container, Box} from '@chakra-ui/react'
import Profile from '../../components/Profile'
import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../config/api'
import PhotosCard from '../../components/PhotosCard'
import {useRouter} from 'next/router'



const ProfilePage = () => {
    const [posts, setPosts] = useState([])
    const userSelector = useSelector((state) => state.user)
    const router = useRouter()
    

    const fetchPosts = async () => {
        try {
            const res = await axiosInstance.get("/posts/user/" + userSelector.id)

            setPosts(res.data.result)
            console.log(userSelector.username);
        } catch (err) {
            console.log(err.message);
          }
    }

    const renderPosts = () => {
        return posts.map((val) =>{
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
        if (userSelector.id) {
            fetchPosts()
        }
        else if (!userSelector.id) {
            router.push("/")
        }
      }, [userSelector.id]);

    //   console.log(posts);


    return (
        <Container borderRadius="md" minW="5xl" shadow="dark-lg" marginTop="10">
            <Profile />
            <Box>
                {renderPosts()}
            </Box>
        </Container>
    )
}

export default ProfilePage