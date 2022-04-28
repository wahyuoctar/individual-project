import {
  Text,
  Divider,
  Input,
  Button,
  Flex,
  Container,
  Box,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../config/api";
import PhotosCard from "../../components/PhotosCard";
import { useFormik } from "formik";

import { fetchUserData } from "../../redux/actions/auth";
import requiresAuth from "../../lib/hoc/requiresAuth";
import Page from "../../components/Page";
import Profile from "../../components/Profile";

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const userSelector = useSelector((state) => state.user);

  const dispatch = useDispatch();
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
          id={val?.id}
          imageUrl={val?.image_url}
          userId={userSelector.id}
          postDate={val?.createdAt}
          isInProfile={true}
          postUserId={val?.user_id}
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
            username={userSelector?.username}
          />
          <Divider />
          <Box padding="2" my="4" width="xl" borderRadius="md">
            <Text textShadow="1px 1px #ff0000" as="h3" fontWeight="bold">
              Please share your moment here!
            </Text>
            <Input
              onChange={(event) =>
                formik.setFieldValue("caption", event.target.value)
              }
              placeholder="Caption..."
              value={formik.values.caption}
            />
            <Input
              onChange={(event) =>
                formik.setFieldValue("location", event.target.value)
              }
              mt={"2"}
              placeholder="Location..."
              value={formik.values.location}
            />

            <Flex my="2" justifyContent="space-between">
              <Input
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFile}
                ref={inputFile}
                type="file"
                display="none"
              />
              <Button
                onClick={() => inputFile.current.click()}
                width="50%"
                mr="1"
                colorScheme="facebook"
              >
                Upload File
              </Button>
              <Button onClick={uploadHandler} width="50%" colorScheme="green">
                Post
              </Button>
            </Flex>
          </Box>
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
