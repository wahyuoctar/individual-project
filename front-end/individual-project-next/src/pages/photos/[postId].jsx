import { Container } from "@chakra-ui/react";
import PhotosCard from "../../components/PhotosCard";
import { useSelector } from "react-redux";
import axios from "axios";

const UsersPhotosPage = ({ photosDetail }) => {
  const userSelector = useSelector((state) => state.user);

  return (
    <Container maxW="5xl" shadow="dark-lg" marginTop="10">
      <PhotosCard
        imageUrl={photosDetail?.image_url}
        avaPic={photosDetail?.User?.ava_pic}
        location={photosDetail?.location}
        fullName={photosDetail?.User?.fullname || "Fullname"}
        postId={photosDetail?.id}
        likes={photosDetail?.like_count}
        caption={photosDetail?.caption}
        postDate={photosDetail?.createdAt}
        userId={userSelector?.id}
        postUserId={photosDetail?.user_id}
      />
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;

  const res = await axios.get(`http://localhost:2000/posts/${postId}`);

  return {
    props: {
      photosDetail: res?.data?.result,
    },
  };
}

export default UsersPhotosPage;
