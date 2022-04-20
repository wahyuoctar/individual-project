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
    <Container borderRadius="md" minW="5xl" shadow="dark-lg" marginTop="10">
      <Box py="4" alignItems="center" display="flex" flexDirection="column">
        <Avatar src={userData?.ava_pic} size="xl" />
        <Text mt="2" fontSize="xl" fontWeight="bold">
          {userData?.fullname}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {userData?.currentCity}
        </Text>

        <Box display="flex" mt="3">
          {/* Box for posts */}
          <Box marginLeft="7">
            <Text textAlign={"center"} fontWeight="bold">
              {userData?.posts}
            </Text>
            <Text color="gray">Posts</Text>
          </Box>

          {/* Box for followers */}
          <Box marginLeft="7">
            <Text textAlign={"center"} fontWeight="bold">
              {userData?.followers}
            </Text>
            <Text color="gray">Followers</Text>
          </Box>

          {/* Box for following */}
          <Box marginLeft="7">
            <Text textAlign={"center"} fontWeight="bold">
              {userData?.following}
            </Text>
            <Text color="gray">Following</Text>
          </Box>
        </Box>

        <Text textAlign="center">{userData?.biography}</Text>
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
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  return {
    props: {},
  };
});

export default ProfilePage;
