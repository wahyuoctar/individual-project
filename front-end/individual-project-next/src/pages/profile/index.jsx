import {
  Text,
  Divider,
  Input,
  Button,
  Flex,
  Container,
  Box,
  Icon,
  Center,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../config/api";
import PhotosCard from "../../components/PhotosCard";
import { useFormik } from "formik";
import { ImFilePicture } from "react-icons/im";
import requiresAuth from "../../lib/hoc/requiresAuth";
import Page from "../../components/Page";
import Profile from "../../components/Profile";
import { fetchUserData } from "../../redux/actions/auth";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [postsLike, setPostsLike] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [postSwitch, setPostSwitch] = useState(false);
  const dispatch = useDispatch();

  const userSelector = useSelector((state) => state.user);

  const refreshPage = () => {
    window.location.reload();
  };

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
      refreshPage();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/" + userSelector.id);

      setUserData(res?.data?.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts/user/" + userSelector.id);
      setPosts(res.data.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <PhotosCard
          fullName={val?.User?.fullname || "Fullname"}
          username={val?.User?.username || "username"}
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

  const resendVerificationBtn = async () => {
    try {
      await axiosInstance.post("/auth/resend-verification");
    } catch (error) {
      toast({
        title: "Can't Reach Verification Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchPostsLike = async () => {
    try {
      const res = await axiosInstance.get(
        "/posts/user-likes/" + userSelector.id
      );
      setPostsLike(res.data.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderPostsLike = () => {
    return postsLike.map((val) => {
      return (
        <PhotosCard
          fullName={val?.Post?.User?.fullname || "Fullname"}
          username={val?.Post?.User?.username || "username"}
          avaPic={val?.Post?.User?.ava_pic}
          caption={val?.Post?.caption}
          likes={val?.Post?.like_count}
          location={val?.Post?.location}
          id={val?.Post?.id}
          imageUrl={val?.Post?.image_url}
          userId={userSelector.id}
          postDate={val?.Post?.createdAt}
          isInProfile={true}
          postUserId={val?.Post?.user_id}
        />
      );
    });
  };

  const switchPost = () => {
    setPostSwitch(false);
    fetchPosts();
  };

  const switchPostLike = () => {
    setPostSwitch(true);
    fetchPostsLike();
  };

  useEffect(() => {
    if (userSelector.id) {
      dispatch(fetchUserData());
      fetchPosts();
      fetchPostsLike();
      fetchUser();
    }
  }, [userSelector.id]);

  return (
    <Page title={`My Profile`}>
      <Container
        fontFamily="sans-serif"
        borderRadius="md"
        minW="5xl"
        shadow="dark-lg"
        my="10"
      >
        <Box py="4" alignItems="center" display="flex" flexDirection="column">
          <Profile
            avaPic={userData?.ava_pic}
            fullName={userData?.fullname}
            biography={userData?.biography}
            currentCity={userData?.current_city}
            followers={userData?.followers}
            following={userData?.following}
            posts={userData?.posts}
            username={userData?.username}
          />
          <Divider />
          {userSelector.is_verified ? (
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
          ) : (
            <Box width="xl" bgColor="#FEBA02" borderRadius="md" p="3" my="3">
              <Text
                fontFamily="sans-serif"
                fontWeight="bold"
                color="white"
                textAlign="center"
              >
                Please verify your Account first before add some post!
              </Text>
              <Center>
                <Button onClick={resendVerificationBtn} colorScheme="green">
                  Verify Account
                </Button>
              </Center>
            </Box>
          )}
        </Box>

        {/* Switch Button To see our post or post we've like */}
        <Center mb="3">
          <Flex>
            {postSwitch ? (
              <>
                <Button onClick={switchPost} mr="3">
                  My Post
                </Button>
                <Button onClick={switchPostLike} colorScheme="red">
                  Post I've Liked
                </Button>
              </>
            ) : (
              <>
                <Button onClick={switchPost} colorScheme="red" mr="3">
                  My Post
                </Button>
                <Button onClick={switchPostLike}>Post I've Liked</Button>
              </>
            )}
          </Flex>
        </Center>

        {postSwitch ? (
          <>
            {postsLike.length ? (
              <Box>{renderPostsLike()}</Box>
            ) : (
              <Box alignItems="center" display="flex" flexDirection="column">
                <Icon boxSize="20" as={ImFilePicture} />
                <Text textAlign="center" fontSize="3xl">
                  YOU HAVEN'T LIKED ANY OF THE POST YET
                </Text>
              </Box>
            )}
          </>
        ) : (
          <>
            {posts.length ? (
              <Box> {renderPosts()}</Box>
            ) : (
              <Box alignItems="center" display="flex" flexDirection="column">
                <Icon boxSize="20" as={ImFilePicture} />
                <Text textAlign="center" fontSize="3xl">
                  YOU HAVEN'T POST ANYTHING YET!
                </Text>
              </Box>
            )}
          </>
        )}
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
