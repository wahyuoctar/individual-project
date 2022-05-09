import { Box, Center, Icon, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useEffect } from "react";

const VerificationSuccessPage = () => {
  const userSelector = useSelector((state) => state.user);
  const router = useRouter();

  const loginPageRedirect = () => {
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  const homePageRedirect = () => {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  useEffect(() => {
    if (userSelector.is_verified) {
      router.push("/profile");
    }
  }, []);

  return (
    <Center mt="100px">
      <Box
        fontFamily="monospace"
        alignItems="center"
        textAlign="center"
        bgColor="#FEBA02"
        borderRadius="md"
        width="md"
        p="4"
      >
        {userSelector.id ? (
          <>
            <Icon as={RiCheckboxCircleLine} boxSize="16" color="green" />
            <Text fontSize="xl" color="white">
              Verification Success! This page will be automatically redirected
              to Home Page after 20 seconds...
            </Text>
            {homePageRedirect()}
          </>
        ) : (
          <>
            <Icon as={RiCheckboxCircleLine} boxSize="16" color="green" />
            <Text fontSize="xl" color="white">
              Verification Success! This page will be automatically redirected
              to Login Page after 20 seconds...
            </Text>
            {loginPageRedirect()}
          </>
        )}
      </Box>
    </Center>
  );
};

module.exports = VerificationSuccessPage;
