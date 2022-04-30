import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
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
import { IoMdHome, IoMdLogIn } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Router from "next/router";

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
      backgroundColor="#BA1B2A"
    >
      <Flex justifyContent="end">
        <Stack spacing={4} direction="row">
          {userSelector.id ? (
            <>
              <Link href="/">
                <Button>
                  <Icon as={IoMdHome} />
                </Button>
              </Link>
              <Menu>
                <MenuButton>
                  <Button>
                    <Icon as={CgProfile} />
                  </Button>
                </MenuButton>
                <MenuList>
                  <Link href="/profile">
                    <MenuItem>My Profile</MenuItem>
                  </Link>
                  <MenuDivider />
                  <Link href="/profile/edit-profile">
                    <MenuItem>Edit Profile</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={logoutBtnHandler}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Link href="/login">
              <Button>
                <Icon as={IoMdLogIn} />
              </Button>
            </Link>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
