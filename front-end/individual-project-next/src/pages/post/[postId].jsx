import {
  Box,
  Avatar,
  Text,
  Image,
  Stack,
  Icon,
  Flex,
  Divider,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  useToast,
  Link,
} from "@chakra-ui/react";
// import Link from "next/link";
import moment from "moment";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { axiosInstance } from "../../config/api";
import { useEffect, useState } from "react";
import { Container } from "@chakra-ui/react";
import PhotosCard from "../../components/PhotosCard";
import { useSelector } from "react-redux";
import axios from "axios";
import Page from "../../components/Page";

const UsersPhotosPage = ({ photosDetail, commentList }) => {
  const userSelector = useSelector((state) => state.user);
  const toast = useToast();

  const deleteButton = async () => {
    try {
      await axiosInstance.delete("/posts/" + photosDetail?.id);
      // router.push("/profile");
      // todos: setelah delete mau nya ngerender tapi pegimane dah
    } catch (error) {
      console.log(error);
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

  const renderComment = () => {
    return commentList.map((val) => {
      return (
        <Box display="flex" marginLeft="4" marginRight="2" marginTop="1">
          <Text lineHeight="4">
            <Link
              className="username"
              fontWeight="bold"
              textDecoration="none"
              href={`/profile/${photosDetail?.user_id}`}
            >
              {val?.User?.username}{" "}
            </Link>
            {val?.content}
          </Text>
        </Box>
      );
    });
  };

  return (
    <Page title={`${photosDetail?.User?.fullname}'s Post`}>
      <Container maxW="5xl" shadow="dark-lg" marginTop="10">
        <Flex mb={"5"}>
          {/* Box for Post Image */}
          <Box my="5" flex={65}>
            <Stack>
              <Image width="100%" src={photosDetail?.image_url} />
            </Stack>
          </Box>

          {/* Box for Post detail */}
          <Box my="5" flex={35}>
            {/* Flex for User Detail */}
            <Flex mx="3" marginTop="2">
              <Box display="flex" flexDirection="column">
                {/* Box for Avatar, Fullname, Location */}
                <Box mb="3" paddingX="2" display="flex" alignItems="center">
                  <Link href={`/profile/${photosDetail?.user_id}`}>
                    <Avatar src={photosDetail?.User?.ava_pic} />
                  </Link>
                  <Box marginLeft="2">
                    <Link
                      textDecoration="none"
                      href={`/profile/${photosDetail?.User?.id}`}
                    >
                      <Text className="fullname" fontWeight="bold">
                        {photosDetail?.User?.fullname}
                      </Text>
                    </Link>
                    <Text color="gray">{photosDetail?.location}</Text>
                  </Box>
                </Box>

                {/* Flex for icon */}
                <Flex>
                  {/* Icon Like */}
                  <Icon
                    boxSize="6"
                    marginRight="4"
                    as={FaRegHeart}
                    sx={{
                      _hover: {
                        cursor: "pointer",
                        color: "blue",
                      },
                    }}
                  ></Icon>

                  {/* Icon Comment */}
                  <Icon
                    boxSize="6"
                    marginRight="4"
                    as={FaRegComment}
                    sx={{
                      _hover: {
                        cursor: "pointer",
                        color: "blue",
                      },
                    }}
                  ></Icon>

                  <Text color="gray.400" fontWeight="hairline" ml={"5"}>
                    ({moment(photosDetail?.createdAt).format("MM/DD")})
                  </Text>
                  {/* Icon Option */}
                  {photosDetail?.user_id == userSelector.id ? (
                    <Menu>
                      <MenuButton>
                        <Icon
                          ml="4"
                          boxSize="6"
                          as={BsGripVertical}
                          sx={{
                            _hover: {
                              cursor: "pointer",
                              color: "blue",
                            },
                          }}
                        ></Icon>
                      </MenuButton>
                      <MenuList>
                        <Link href={`/edit-post/${photosDetail?.id}`}>
                          <MenuItem>Edit Post</MenuItem>
                        </Link>
                        <MenuItem onClick={deleteButton}>Delete Post</MenuItem>
                      </MenuList>
                    </Menu>
                  ) : null}
                </Flex>

                <Text fontSize="sm" fontWeight="bold">
                  {photosDetail?.likes?.toLocaleString()} likes
                </Text>
                <Text>{photosDetail?.caption}</Text>
              </Box>
            </Flex>
            <Divider ml={"2"} />

            {/* Box Comment */}
            {renderComment()}
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
      commentList: res?.data?.result?.comment,
    },
  };
}

export default UsersPhotosPage;
