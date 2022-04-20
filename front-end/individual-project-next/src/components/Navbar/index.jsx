import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, userLogin } from "../../redux/actions/auth";
import { user_types } from "../../redux/types/user";
import jsCookie from "js-cookie";
import Router, { useRouter } from "next/router";

const Navbar = () => {
  const authSelector = useSelector((state) => state.auth);
  const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (authSelector.id) {
      dispatch(fetchUserData());
    }
  }, [authSelector.id]);

  const logoutBtnHandler = () => {
    dispatch({
      type: user_types.LOGOUT_USER,
    });

    jsCookie.remove("user_token");
    Router.push("/");
  };

  return (
    <Box
      paddingY={4}
      paddingX={8}
      borderBottom="1px solid"
      borderBottomColor="gray.200"
      position="sticky"
    >
      <Flex justifyContent="space-between">
        <Stack spacing={4} direction="row">
          <Link href="/">
            <Button>Home</Button>
          </Link>
          {userSelector.id ? (
            <Link href="/profile">
              <Button colorScheme="messenger">Profile</Button>
            </Link>
          ) : null}
        </Stack>

        <Stack spacing={4} direction="row">
          {userSelector.id ? (
            <>
              <Menu>
                <MenuButton>
                  <Avatar src={userSelector?.ava_pic} />
                </MenuButton>
                <MenuList>
                  <Link href="/profile/edit-profile">
                    <MenuItem>Edit My Profile</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
              <Button onClick={logoutBtnHandler} colorScheme="blackAlpha">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button colorScheme="teal">Login</Button>
            </Link>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
