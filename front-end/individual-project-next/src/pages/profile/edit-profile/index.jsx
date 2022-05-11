import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Page from "../../../components/Page";
import { useFormik } from "formik";
import { fetchUserData } from "../../../redux/actions/auth";
import requiresAuth from "../../../lib/hoc/requiresAuth";
import { user_types } from "../../../redux/types";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();

  const toast = useToast();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);

  const userSelector = useSelector((state) => state.user);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/" + userSelector.id);

      setUserData(res?.data?.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const inputFile = useRef(null);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    alert(event.target.files[0].name);
  };

  const uploadHandler = async () => {
    const formData = new FormData();
    // const { fullname, username, biography, current_city } = formik.values;

    // formData.append("fullname", fullname);
    // formData.append("username", username);
    // formData.append("biography", biography);
    // formData.append("current_city", current_city);
    formData.append("ava_pics", selectedFile);
    // fetchUser();

    // router.push("/");

    try {
      await axiosInstance.patch("/users/" + userData?.id + "/avatar", formData);
      setSelectedFile(null);

      const newData = {
        username: userData.username,
        id: userSelector.id,
        email: userSelector.email,
        biography: userData.biography,
        current_city: userData.current_city,
        ava_pic: userData.ava_pic,
        is_verified: userData.is_verified,
        fullname: userData.fullname,
        followers: userData.followers,
        following: userData.following,
        posts: userData.posts,
      };
      dispatch({
        type: user_types.LOGIN_USER,
        payload: newData,
      });

      fetchUser();
    } catch (error) {
      toast({
        title: "Can't Reach Edit Avatar Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      biography: "",
      current_city: "",
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await axiosInstance.patch("/users/" + userSelector.id, {
          fullname: values.fullname,
          username: values.username,
          biography: values.biography,
          current_city: values.current_city,
        });

        const newData = {
          username: userData.username || userSelector.username,
          id: userSelector.id,
          email: userSelector.email,
          biography: userData.biography || userSelector.biography,
          current_city: userData.current_city || userSelector.current_city,
          ava_pic: userData.ava_pic || userSelector.ava_pic,
          is_verified: userData.is_verified,
          fullname: userData.fullname || userSelector.fullname,
          followers: userData.followers,
          following: userData.following,
          posts: userData.posts,
        };
        dispatch({
          type: user_types.LOGIN_USER,
          payload: newData,
        });

        formik.setFieldValue("fullname", "");
        formik.setFieldValue("username", "");
        formik.setFieldValue("current_city", "");
        formik.setFieldValue("biography", "");
        router.push("/profile");
      } catch (error) {
        toast({
          title: "Can't Reach Edit User Data Server",
          description: "Connect The Server",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    },
  });

  useEffect(() => {
    if (userSelector.id) {
      dispatch(fetchUserData());

      fetchUser();
    }
  }, [userSelector.id]);

  return (
    <Page title={`Edit My Profile`}>
      <Container
        fontFamily="sans-serif"
        borderRadius="md"
        py="4"
        alignItems="center"
        display="flex"
        flexDirection="column"
        shadow="dark-lg"
        marginTop="10"
      >
        <Flex flexDirection="column">
          <Center>
            <Input
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFile}
              ref={inputFile}
              type="file"
              display="none"
            />
            <Avatar
              onClick={() => inputFile.current.click()}
              src={userData?.ava_pic}
              size="xl"
              _hover={{ cursor: "pointer" }}
            />
          </Center>
          <Button mt="3" colorScheme="green" onClick={uploadHandler}>
            UPLOAD AVATAR
          </Button>
        </Flex>

        <form>
          <Input
            placeholder={`${userData?.fullname || "Fullname"}`}
            onChange={(event) =>
              formik.setFieldValue("fullname", event.target.value)
            }
            value={formik.values.fullname}
            my="4"
          />
          <Input
            placeholder={`${userData?.username || "Username"}`}
            onChange={(event) =>
              formik.setFieldValue("username", event.target.value)
            }
            value={formik.values.username}
            my="4"
          />
          <Input
            placeholder={`${userData?.biography || "Biography"}`}
            onChange={(event) =>
              formik.setFieldValue("biography", event.target.value)
            }
            value={formik.values.biography}
            my="4"
          />
          <Input
            placeholder={`${userData?.current_city || "Current City"}`}
            onChange={(event) =>
              formik.setFieldValue("current_city", event.target.value)
            }
            value={formik.values.current_city}
            my="4"
          />
          <Box>
            <Button
              type="submit"
              onClick={formik.handleSubmit}
              colorScheme="green"
            >
              Save
            </Button>
            <Link href="/profile">
              <Button ml="2" colorScheme="red">
                Cancel
              </Button>
            </Link>
          </Box>
        </form>
      </Container>
    </Page>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  return {
    props: {},
  };
});

export default EditProfilePage;
