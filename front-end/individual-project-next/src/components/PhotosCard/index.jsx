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
import { useSelector } from "react-redux";
import { axiosInstance } from "../../config/api";
import { useEffect, useState } from "react";

const PhotosCard = ({
  imageUrl,
  avaPic,
  location,
  fullName,
  id: postId,
  userId,
  postUserId,
  likes,
  caption,
  postDate,
  isInDetail = false,
  isInProfile = false,
}) => {
  const userSelector = useSelector((state) => state.user);
  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const toast = useToast();

  const commentLimit = 5;

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get("/posts/" + postId, {
        params: {
          _page: page,
          _limit: commentLimit,
        },
      });

      setCount(res?.data?.result?.comment?.count);
      setCommentList((prevComments) => [
        ...prevComments,
        ...res?.data?.result?.comment?.rows,
      ]);
    } catch (error) {
      toast({
        title: "Can't Reach The Comment Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const deleteButton = async () => {
    try {
      await axiosInstance.delete("/posts/" + postId);
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
    if (isInProfile) {
      return commentList.map((val) => {
        return (
          <Box display="flex" marginLeft="4" marginRight="2" marginTop="1">
            <Text lineHeight="4">
              <b>{val?.User?.username} </b>
              <span style={{ color: "gray.400", fontWeight: "lighter" }}>
                {`(${moment(val?.createdAt).format("MM/DD")})`}{" "}
              </span>
              {val?.content}
            </Text>
          </Box>
        );
      });
    } else if (!isInProfile) {
      return commentList.map((val) => {
        return (
          <Box display="flex" marginLeft="4" marginRight="2" marginTop="1">
            <Text lineHeight="4">
              {val?.user_id == userSelector?.id ? (
                <>
                  <Link
                    className="username"
                    fontWeight="bold"
                    textDecoration="none"
                    href={`/profile`}
                  >
                    {val?.User?.username}{" "}
                  </Link>
                  <span style={{ color: "gray.400", fontWeight: "lighter" }}>
                    {`(${moment(val?.createdAt).format("MM/DD")})`}{" "}
                  </span>
                </>
              ) : (
                <>
                  <Link
                    className="username"
                    fontWeight="bold"
                    textDecoration="none"
                    href={`/profile/${val?.user_id}`}
                  >
                    {val?.User?.username}{" "}
                  </Link>
                  <span style={{ color: "gray.400", fontWeight: "lighter" }}>
                    {`(${moment(val?.createdAt).format("MM/DD")})`}{" "}
                  </span>
                </>
              )}

              {val?.content}
            </Text>
          </Box>
        );
      });
    }
  };

  const viewCommentButton = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (userSelector.id) {
      fetchComments();
    }
  }, [userSelector.id, page]);

  return (
    // <Container maxW="5xl" shadow="lg" marginTop="10">
    <Flex mb={"5"}>
      {/* Box for Post Image */}
      <Box my="5" flex={65}>
        <Stack>
          {isInDetail ? (
            <Image width="100%" src={imageUrl} />
          ) : (
            <Link href={`/post/${postId}`}>
              <Image width="100%" src={imageUrl} />
            </Link>
          )}
        </Stack>
      </Box>

      {/* Box for Post detail */}
      <Box my="5" flex={35}>
        {/* Flex for User Detail */}
        <Flex mx="3" marginTop="2">
          <Box display="flex" flexDirection="column">
            {/* Box for Avatar, Fullname, Location */}
            <Box mb="3" paddingX="2" display="flex" alignItems="center">
              {isInProfile ? (
                <Avatar src={avaPic} />
              ) : (
                <Link href={`/profile/${userId}`}>
                  <Avatar src={avaPic} />
                </Link>
              )}
              <Box marginLeft="2">
                {isInProfile ? (
                  <Text className="fullname" fontWeight="bold">
                    {fullName}
                  </Text>
                ) : (
                  <Link textDecoration="none" href={`/profile/${userId}`}>
                    <Text className="fullname" fontWeight="bold">
                      {fullName}
                    </Text>
                  </Link>
                )}
                <Text color="gray">{location}</Text>
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
                ({moment(postDate).format("MM/DD")})
              </Text>
              {/* Icon Option */}
              {postUserId == userSelector.id ? (
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
                    <Link href={`/edit-post/${postId}`}>
                      <MenuItem>Edit Post</MenuItem>
                    </Link>
                    <MenuItem onClick={deleteButton}>Delete Post</MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </Flex>

            <Text fontSize="sm" fontWeight="bold">
              {likes?.toLocaleString()} likes
            </Text>
            <Text>{caption}</Text>
          </Box>
        </Flex>
        <Divider ml={"2"} />

        {/* Box Comment */}
        {renderComment()}
        {(page * commentLimit) % count === page * commentLimit ? (
          <Text
            sx={{
              _hover: {
                cursor: "pointer",
                color: "blue",
              },
            }}
            onClick={viewCommentButton}
            textAlign="center"
            marginTop="1"
          >
            View All Comments
          </Text>
        ) : null}
      </Box>
    </Flex>
    // </Container>
  );
};

export default PhotosCard;
