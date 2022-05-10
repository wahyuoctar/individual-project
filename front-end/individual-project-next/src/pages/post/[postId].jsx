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
  FormControl,
  FormHelperText,
  Input,
  Button,
  IconButton,
} from "@chakra-ui/react";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import moment from "moment";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { axiosInstance } from "../../config/api";
import { useEffect, useState } from "react";
import { Container } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Page from "../../components/Page";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiLink } from "react-icons/bi";

const UsersPhotosPage = ({ photosDetail, commentList, count }) => {
  const [userComments, setUserComments] = useState([]);
  const userSelector = useSelector((state) => state.user);
  const [viewComment, setViewComment] = useState(false);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const [postLikes, setPostLikes] = useState({});
  const [likePost, setLikePost] = useState(false);
  const router = useRouter();

  const commentLimit = 5;

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

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/comments/post/" + photosDetail?.id, {
          post_id: photosDetail?.id,
          user_id: userSelector.id,
          content: values.content,
        });

        formik.setFieldValue("content", "");
        fetchComments();
        renderComment();
        setViewComment(false);
      } catch (error) {
        toast({
          title: "Can't Add a Comment",
          description: "Connect The Server",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    },
    validationSchema: Yup.object().shape({
      content: Yup.string().max(300, "You've reached Max Character"),
    }),
  });

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get("/posts/" + photosDetail?.id, {
        params: {
          _page: page,
          _limit: commentLimit,
        },
      });

      setUserComments((prevComments) => [
        ...prevComments,
        ...res?.data?.result?.comment?.rows,
      ]);
    } catch (error) {
      console.log(error);
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

  const viewCommentButton = () => {
    setPage(page + 1);
  };

  const hideCommentBtn = () => {
    setViewComment(!viewComment);
  };

  const renderComment = () => {
    return userComments.map((val) => {
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
  };

  const fetchLike = async () => {
    try {
      const res = await axiosInstance.get("/likes/post/" + photosDetail?.id);

      const res2 = await axiosInstance.get("/posts/" + photosDetail?.id, {
        params: {
          _page: page,
          _limit: commentLimit,
        },
      });

      setPostLikes(res2?.data?.result?.post?.like_count);

      if (!res?.data?.result) {
        return setLikePost(false);
      } else if (res?.data?.result) {
        return setLikePost(true);
      }
    } catch (error) {
      toast({
        title: "Can't Reach Like Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const likeButton = async () => {
    try {
      await axiosInstance.post("/likes/post/" + photosDetail?.id);

      setLikePost(true);
      fetchLike();
    } catch (error) {
      toast({
        title: "Can't Reach Like Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const unlikeButton = async () => {
    try {
      await axiosInstance.delete("/likes/post/" + photosDetail?.id);

      setLikePost(false);
      fetchLike();
    } catch (error) {
      toast({
        title: "Can't Reach Like Server",
        description: "Connect The Server",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const webUrl = `https://localhost:3000`;

  const copyLinkBtnHandler = () => {
    navigator.clipboard.writeText(`${webUrl}${router.asPath}`);

    toast({
      position: "top-right",
      status: "info",
      title: "Link copied",
    });
  };

  useEffect(() => {
    if (userSelector.id) {
      fetchComments();
      fetchLike();
    }
    return fetchLike();
  }, [userSelector.id, page]);

  return (
    <Page
      title={`${photosDetail?.User?.fullname}'s Post`}
      description={photosDetail.caption}
      image={photosDetail.image_url}
      url={`${webUrl}${router.asPath}`}
    >
      <Container
        fontFamily="sans-serif"
        maxW="5xl"
        shadow="dark-lg"
        marginTop="10"
      >
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
                {/* Box for Avatar, username, Location */}

                {photosDetail?.user_id == userSelector.id ? (
                  <Box mb="3" paddingX="2" display="flex" alignItems="center">
                    <Link href={`/profile`}>
                      <Avatar src={photosDetail?.User?.ava_pic} />
                    </Link>
                    <Box marginLeft="2">
                      <Link textDecoration="none" href={`/profile`}>
                        <Text className="username" fontWeight="bold">
                          {photosDetail?.User?.username}
                        </Text>
                      </Link>
                      <Text color="gray">{photosDetail?.location}</Text>
                    </Box>
                  </Box>
                ) : (
                  <Box mb="3" paddingX="2" display="flex" alignItems="center">
                    <Link href={`/profile/${photosDetail?.user_id}`}>
                      <Avatar src={photosDetail?.User?.ava_pic} />
                    </Link>
                    <Box marginLeft="2">
                      <Link
                        textDecoration="none"
                        href={`/profile/${photosDetail?.User?.id}`}
                      >
                        <Text className="username" fontWeight="bold">
                          {photosDetail?.User?.username}
                        </Text>
                      </Link>
                      <Text color="gray">{photosDetail?.location}</Text>
                    </Box>
                  </Box>
                )}

                {/* Flex for icon */}
                <Flex>
                  {/* Icon Like */}

                  {userSelector.is_verified ? (
                    <>
                      {likePost ? (
                        <Icon
                          boxSize="6"
                          onClick={unlikeButton}
                          marginRight="4"
                          as={FaHeart}
                          sx={{
                            _hover: {
                              cursor: "pointer",
                              color: "blue",
                            },
                          }}
                        ></Icon>
                      ) : (
                        <Icon
                          boxSize="6"
                          onClick={likeButton}
                          marginRight="4"
                          as={FaRegHeart}
                          sx={{
                            _hover: {
                              cursor: "pointer",
                              color: "blue",
                            },
                          }}
                        ></Icon>
                      )}

                      {/* Icon Comment */}

                      <Icon
                        onClick={hideCommentBtn}
                        boxSize="6"
                        marginRight="9"
                        as={FaRegComment}
                        sx={{
                          _hover: {
                            cursor: "pointer",
                            color: "blue",
                          },
                        }}
                      ></Icon>
                    </>
                  ) : null}

                  <Text color="gray.400" fontWeight="hairline">
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
                  {postLikes?.toLocaleString() ||
                    photosDetail?.like_count?.toLocaleString()}{" "}
                  likes
                </Text>
                <Text>{photosDetail?.caption}</Text>
              </Box>
            </Flex>
            <Divider ml={"2"} />

            {/* SSR */}
            <Flex ml="3" mt="1">
              <WhatsappShareButton
                url={`${webUrl}${router.asPath}`}
                title={`${photosDetail?.User?.fullname}'s Post`}
              >
                <WhatsappIcon size="40" round />
              </WhatsappShareButton>
              <TwitterShareButton
                url={`${webUrl}${router.asPath}`}
                title={`${photosDetail?.User?.fullname}'s Post`}
              >
                <TwitterIcon size="40" round />
              </TwitterShareButton>
              <FacebookShareButton
                url={`${webUrl}${router.asPath}`}
                quote={`${photosDetail?.User?.fullname}'s Post`}
              >
                <FacebookIcon size="40" round />
              </FacebookShareButton>
              <IconButton
                onClick={copyLinkBtnHandler}
                borderRadius="50%"
                icon={<Icon as={BiLink} />}
              />
            </Flex>

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

            {viewComment ? (
              <FormControl mt="3" ml="2" isInvalid={formik.errors.content}>
                <FormHelperText>{formik.errors.content}</FormHelperText>
                <Flex>
                  <Input
                    onChange={(event) =>
                      formik.setFieldValue("content", event.target.value)
                    }
                    value={formik.values.content}
                    placeholder={"Add a comment ..."}
                  />
                  <Button onClick={formik.handleSubmit} colorScheme="green">
                    Send
                  </Button>
                </Flex>
              </FormControl>
            ) : null}
          </Box>
        </Flex>
      </Container>
    </Page>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;
  const limitComment = 5;

  const res = await axios.get(`http://localhost:2000/posts/${postId}`, {
    params: {
      _page: 1,
      _limit: limitComment,
    },
  });

  return {
    props: {
      photosDetail: res?.data?.result?.post,
      commentList: res?.data?.result?.comment?.rows,
      count: res?.data?.result?.comment?.count,
    },
  };
}

export default UsersPhotosPage;
