import {Container, Box} from '@chakra-ui/react'
import Profile from '../../components/Profile'
import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../config/api'
import PhotosCard from '../../components/PhotosCard'



const ProfilePage = () => {
    const [posts, setPosts] = useState([])
    const authSelector = useSelector((state) => state.user)

    const fetchPosts = async () => {
        try {
            const res = await axiosInstance.get("/posts/user/" + authSelector.id)

            setPosts(res.data.result)
            console.log(authSelector.username);
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
          fetchPosts()
      }, []);

      console.log(posts);

    return (
        <Container minW="xl" shadow="dark-lg" marginTop="10">
            <Profile />
            <Box>
                {renderPosts()}
            </Box>
        </Container>
    )
}

export default ProfilePage