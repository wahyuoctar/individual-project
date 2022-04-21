import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Page from "../../../components/Page";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();

  const userSelector = useSelector((state) => state.user);
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
        <Input value={`${userData?.fullname}`} my="4" />
        <Input value={`${userData?.username}`} my="4" />
        <Input value={`${userData?.biography}`} my="4" />
        <Input value={`${userData?.current_city}`} my="4" />
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
