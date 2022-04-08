import {Box, Avatar, Text, Image, Stack, Container, Flex, SimpleGrid, Divider} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import { axiosInstance } from '../../config/api'
import PhotosCard from '../../components/PhotosCard'

const UsersPhotosPage = ({photosDetail, webUrl}) => {
    

    return (
        <Container maxW="5xl" shadow="lg" marginTop="10">

        <PhotosCard imageUrl={photosDetail?.image_url}
        avaPic={photosDetail?.ava_pic}
        location={photosDetail?.location}
        fullName={photosDetail?.fullname || "Fullname"}
        id={photosDetail?.id}
        likes={photosDetail?.likes}
        caption={photosDetail?.caption}
        />
        </Container>
    )
}

export async function getServerSideProps(context) {
    const id = context.params.id

    const res = await axiosInstance.get("/posts/" + id)

    return {
        props: {
            photosDetail: res.data.result,
            webUrl: "http://localhost:3000/home/" + id
        }
    }
}

export default UsersPhotosPage