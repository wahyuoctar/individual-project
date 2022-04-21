import {
  Avatar,
  Box,
  Button,
  Container,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Page from "../../../components/Page";
import { useFormik } from "formik";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({});

  const toast = useToast();
  const router = useRouter();

  const userSelector = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      fullname: `${userData?.fullname}`,
      username: `${userData?.username}`,
      biography: `${userData?.biography}`,
      current_city: `${userData?.current_city}`,
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await axiosInstance.patch("/users" + userSelector.id, {
          fullname: values.fullname,
          username: values.username,
          biography: values.biography,
          current_city: values.current_city,
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
    },
  });
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/users/" + userSelector.id);

      setUserData(res.data.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (userSelector.id) {
      fetchUser();
    } else if (!userSelector.id) {
      router.push("/");
    }
  }, [userSelector.id]);

  return (
    <Page title={`Edit My Profile`}>
      <Container
        borderRadius="md"
        py="4"
        alignItems="center"
        display="flex"
        flexDirection="column"
        shadow="dark-lg"
        marginTop="10"
      >
        <Avatar src={userData?.ava_pic} size="xl" />
        <Input
          placeholder="Fullname"
          onChange={(event) => setFieldValue("fullname", event.target.value)}
          value={formik.values.fullname}
          my="4"
        />
        <Input
          placeholder="Username"
          onChange={(event) => setFieldValue("username", event.target.value)}
          value={formik.values.username}
          my="4"
        />
        <Input
          placeholder="Biography"
          onChange={(event) => setFieldValue("biography", event.target.value)}
          value={formik.values.biography}
          my="4"
        />
        <Input
          placeholder="Current City"
          onChange={(event) =>
            setFieldValue("current_city", event.target.value)
          }
          value={formik.values.current_city}
          my="4"
        />
        <Box>
          <Button colorScheme="green">Save</Button>
          <Link href="/profile">
            <Button colorScheme="red">Cancel</Button>
          </Link>
        </Box>
      </Container>
    </Page>
  );
};

export default EditProfilePage;
