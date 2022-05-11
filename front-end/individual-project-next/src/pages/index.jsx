import PhotosCard from "../components/PhotosCard";
import { axiosInstance } from "../config/api";
import { useState, useEffect } from "react";
import {
  useToast,
  Container,
  Spinner,
  Center,
  Text,
  Box,
} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import Page from "../components/Page";
import { useRouter } from "next/router";

const HomePage = () => {
  const [contentList, setContentList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const userSelector = useSelector((state) => state.user);
  const router = useRouter();

  const toast = useToast();

  const limitPage = 5;

  const fetchContentList = async () => {
    try {
      const res = await axiosInstance.get(`/posts`, {
        params: {
          _limit: limitPage,
          _page: page,
        },
      });
      setCount(res.data.result.count);
      setContentList((prevPosts) => [...prevPosts, ...res.data.result.rows]);
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

  const fetchNextPage = () => {
    setPage(page + 1);
  };

  // Untuk render content
  const renderContentList = () => {
    return contentList.map((val) => {
      return (
        <PhotosCard
          fullName={val?.User?.fullname || "Fullname"}
          username={val?.User?.username || "Username"}
          avaPic={val?.User?.ava_pic}
          caption={val?.caption}
          location={val?.location}
          imageUrl={val?.image_url}
          id={val?.id}
          userId={val?.User?.id}
          postDate={val?.createdAt}
          isInProfile={val?.User?.id == userSelector.id ? true : false}
          postUserId={val?.user_id}
        />
      );
    });
  };

  useEffect(() => {
    if (userSelector.id) {
      fetchContentList();
    } else if (!userSelector.id) {
      router.push("/login");
    }
  }, [userSelector.id, page, contentList.like_count]);

  return (
    <Page title={`Home`}>
      <InfiniteScroll
        dataLength={contentList.length}
        next={fetchNextPage}
        hasMore={(page * limitPage) % count === page * limitPage ? true : false}
        loader={
          <Center>
            <Box width="2xs">
              <Center>
                <Spinner />
              </Center>
              <Text textAlign={"center"}>Loading...</Text>
            </Box>
          </Center>
        }
        onScroll={false}
      >
        <Container
          fontFamily="sans-serif"
          borderRadius="md"
          maxW="5xl"
          shadow="dark-lg"
          marginTop="10"
        >
          {renderContentList()}
        </Container>
      </InfiniteScroll>
    </Page>
  );
};

export default HomePage;
