import {
  Avatar,
  Box,
  Button,
  Container,
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
  const authSelector = useSelector((state) => state.auth);

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
    const { fullname, username, biography, current_city } = formik.values;

    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("biography", biography);
    formData.append("current_city", current_city);
    formData.append("ava_pics", selectedFile);

    // fetchUser();

    // router.push("/");

    try {
      await axiosInstance.patch("/users/" + userData.id, formData);
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
      dispatch({
        type: user_types.KEEP_LOGIN,
        payload: newData,
      });
      formik.setFieldValue("fullname", "");
      formik.setFieldValue("username", "");
      formik.setFieldValue("biography", "");
      formik.setFieldValue("current_city", "");
    } catch (error) {
      toast({
        title: "Can't Reach The Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      fullname: `${userSelector?.fullname}`,
      username: ``,
      biography: `${userSelector?.biography}`,
      current_city: `${userSelector?.current_city}`,
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (userSelector.id) {
      dispatch(fetchUserData());

      fetchUser();
    } else if (!userSelector.id) {
      router.push("/");
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
        <form>
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
          />
          <Input
            placeholder="Fullname"
            onChange={(event) =>
              formik.setFieldValue("fullname", event.target.value)
            }
            value={formik.values.fullname}
            my="4"
          />
          <Input
            placeholder={`${userData?.username}`}
            onChange={(event) =>
              formik.setFieldValue("username", event.target.value)
            }
            value={formik.values.username}
            my="4"
          />
          <Input
            placeholder="Biography"
            onChange={(event) =>
              formik.setFieldValue("biography", event.target.value)
            }
            value={formik.values.biography}
            my="4"
          />
          <Input
            placeholder="Current City"
            onChange={(event) =>
              formik.setFieldValue("current_city", event.target.value)
            }
            value={formik.values.current_city}
            my="4"
          />
          <Box>
            <Button type="submit" onClick={uploadHandler} colorScheme="green">
              Save
            </Button>
            <Link href="/profile">
              <Button colorScheme="red">Cancel</Button>
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
