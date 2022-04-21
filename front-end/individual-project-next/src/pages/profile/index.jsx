import {
  Avatar,
  Text,
  Divider,
  Input,
  Button,
  Flex,
  Container,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../config/api";
import PhotosCard from "../../components/PhotosCard";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { fetchUserData } from "../../redux/actions/auth";
import requiresAuth from "../../lib/hoc/requiresAuth";
import Page from "../../components/Page";
import Profile from "../../components/Profile";
import PostUploader from "../../components/PostUploader";

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const userSelector = useSelector((state) => state.user);
  const authSelector = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const inputFile = useRef(null);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    alert(event.target.files[0].name);
  };

  const formik = useFormik({
    initialValues: {
      caption: "",
      location: "",
    },
  });

  const uploadHandler = async () => {
    if (!selectedFile) {
      alert("Select your Image First!");
      return;
    }

    const formData = new FormData();
    const { caption, location } = formik.values;

    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("user_id", userSelector.id);
    formData.append("image_url", selectedFile);

    try {
      await axiosInstance.post("/posts", formData);
      setSelectedFile(null);
      formik.setFieldValue("caption", "");
      formik.setFieldValue("location", "");
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts/user/" + userSelector.id);

      setPosts(res.data.result);
      setUserData(res.data.result[1].User);
      console.log(userSelector.username);
      console.log(userData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <PhotosCard
          fullName={val?.User?.fullname || "Fullname"}
          avaPic={val?.User?.ava_pic}
          caption={val?.caption}
          likes={val?.like_count}
          location={val?.location}
          imageUrl={val?.image_url}
          id={val?.id}
          postDate={val?.createdAt}
        />
      );
    });
  };

  useEffect(() => {
    if (userSelector.id) {
      dispatch(fetchUserData());
      fetchPosts();
    }
  }, [userSelector.id]);

  //   console.log(posts);

  return (
    <Page title={`My Profile`}>
      <Container borderRadius="md" minW="5xl" shadow="dark-lg" marginTop="10">
        <Box py="4" alignItems="center" display="flex" flexDirection="column">
          <Profile
            avaPic={userSelector?.ava_pic}
            fullName={userSelector?.fullname}
            biography={userSelector?.biography}
            currentCity={userSelector?.current_city}
            followers={userSelector?.followers}
            following={userSelector?.following}
            posts={userSelector?.posts}
          />
          <Divider />
          <PostUploader />
        </Box>
        <Box>{renderPosts()}</Box>
      </Container>
    </Page>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  return {
    props: {},
  };
});

export default ProfilePage;
