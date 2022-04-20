import {
  Box,
  Avatar,
  Text,
  Image,
  Stack,
  Container,
  Flex,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance } from "../../config/api";
import PhotosCard from "../../components/PhotosCard";

const EditPostPage = ({ photosDetail }) => {
  return (
    <Container maxW="5xl" shadow="dark-lg" marginTop="10">
      <PhotosCard
        imageUrl={photosDetail?.image_url}
        avaPic={photosDetail?.User?.ava_pic}
        location={photosDetail?.location}
        fullName={photosDetail?.User?.fullname || "Fullname"}
        id={photosDetail?.id}
        likes={photosDetail?.like_count}
        caption={photosDetail?.caption}
        postDate={photosDetail?.createdAt}
      />
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;

  const res = await axiosInstance.get(`/posts/${postId}`);

  return {
    props: {
      photosDetail: res.data.result,
    },
  };
}

export default EditPostPage;
