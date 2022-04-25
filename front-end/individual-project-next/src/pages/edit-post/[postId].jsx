import {
  Box,
  Avatar,
  Text,
  Image,
  Stack,
  useToast,
  Flex,
  Divider,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Input,
  Container,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { axiosInstance } from "../../config/api";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { useFormik } from "formik";
import Page from "../../components/Page";

const EditPostPage = ({ photosDetail }) => {
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      caption: `${photosDetail?.caption}`,
      location: `${photosDetail?.location}`,
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await axiosInstance.patch("/posts/" + photosDetail.id, {
          caption: values.caption,
          location: values.location,
        });

        formik.setFieldValue("caption", "");
        formik.setFieldValue("location", "");
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

  return (
    <Page title={`Edit Post`}>
      <Container maxW="5xl" shadow="lg" marginTop="10">
        <Flex mb={"5"}>
          <Box my="5" flex={65}>
            <Stack>
              <Image width="100%" src={photosDetail?.image_url} />
            </Stack>
          </Box>

          <Box my="5" flex={35}>
            <Flex px="5" marginTop="2">
              <Box display="flex" flexDirection="column">
                <Box mb="3" paddingX="2" display="flex" alignItems="center">
                  <Avatar src={photosDetail?.User?.ava_pic} />
                  <Box marginLeft="2">
                    <Text className="username" fontWeight="bold">
                      {photosDetail?.User?.fullname}
                    </Text>
                  </Box>
                </Box>
                <Box width="xs">
                  <FormLabel>Number of Likes:</FormLabel>
                  <Text textAlign="end">
                    {photosDetail?.like_count?.toLocaleString()}
                  </Text>

                  <FormLabel>Created At:</FormLabel>
                  <Text
                    textAlign="end"
                    color="gray.400"
                    fontWeight="hairline"
                    ml={"5"}
                  >
                    {moment(photosDetail?.createdAt).format("DD MMMM YYYY")}
                  </Text>
                  <FormLabel>Location: </FormLabel>
                  <Input
                    textAlign="end"
                    width="100%"
                    placeholder="Location..."
                    mb="2"
                    onChange={(event) =>
                      formik.setFieldValue("location", event.target.value)
                    }
                    value={formik.values.location}
                  />

                  <FormLabel>Caption: </FormLabel>
                  <Input
                    textAlign="end"
                    width="100%"
                    placeholder="Caption..."
                    onChange={(event) =>
                      formik.setFieldValue("caption", event.target.value)
                    }
                    value={formik.values.caption}
                  />
                </Box>
                <Box mt="3" align="end">
                  <Button
                    onClick={formik.handleSubmit}
                    colorScheme="green"
                    mr="3"
                    width="fit-content"
                  >
                    Save
                  </Button>
                  <Link href={`/profile`}>
                    <Button colorScheme="red" width="fit-content">
                      Cancel
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;

  const res = await axios.get(`http://localhost:2000/posts/${postId}`);

  return {
    props: {
      photosDetail: res?.data?.result?.post,
      //   userData: res?.data?.result[0]?.User,
    },
  };
}

export default EditPostPage;
