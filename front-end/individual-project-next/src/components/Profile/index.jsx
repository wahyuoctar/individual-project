import {
  Avatar,
  Box,
  Container,
  Text,
  Divider,
  Input,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { axiosInstance } from "../../config/api";
import { useRef, useState, useEffect } from "react";
// import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../../redux/actions/auth";
import { useRouter } from "next/router";

const Profile = ({
  avaPic,
  fullName,
  posts,
  followers,
  following,
  biography,
  currentCity,
  username,
}) => {
  const userSelector = useSelector((state) => state.user);
  const authSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (authSelector.id) {
      dispatch(fetchUserData());
    }
  }, [authSelector.id]);

  return (
    <>
      <Avatar src={avaPic} size="xl" />
      <Text mt="2" fontSize="xl" fontWeight="bold">
        {fullName}
      </Text>
      <Text fontSize="medium" color="gray.500">
        @{username}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {currentCity}
      </Text>

      <Box display="flex" mt="3">
        {/* Box for posts */}
        <Box marginLeft="7">
          {posts > 1 ? (
            <>
              <Text textAlign={"center"} fontWeight="bold">
                {posts}
              </Text>
              <Text color="gray">Posts</Text>
            </>
          ) : (
            <>
              <Text textAlign={"center"} fontWeight="bold">
                {posts}
              </Text>
              <Text color="gray">Post</Text>
            </>
          )}
        </Box>

        {/* Box for followers */}
        <Box marginLeft="7">
          {followers > 1 ? (
            <>
              <Text textAlign={"center"} fontWeight="bold">
                {followers}
              </Text>
              <Text color="gray">Followers</Text>
            </>
          ) : (
            <>
              <Text textAlign={"center"} fontWeight="bold">
                {followers}
              </Text>
              <Text color="gray">Follower</Text>
            </>
          )}
        </Box>

        {/* Box for following */}
        <Box marginLeft="7">
          <Text textAlign={"center"} fontWeight="bold">
            {following}
          </Text>
          <Text color="gray">Following</Text>
        </Box>
      </Box>

      <Text textAlign="center">{biography}</Text>
    </>
  );
};

export default Profile;
