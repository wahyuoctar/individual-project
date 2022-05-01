import {
  InputRightElement,
  Icon,
  Text,
  Box,
  Input,
  FormControl,
  Button,
  Center,
  Divider,
  useToast,
  FormHelperText,
  InputGroup,
  Heading,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { userLogin } from "../../redux/actions/auth";
import Page from "../../components/Page";

const LoginPage = () => {
  const userSelector = useSelector((state) => state.user);
  const [visiblePassword, setVisiblePassword] = useState(false);

  // Variable untuk dispatch
  const dispatch = useDispatch();

  // Variable untuk toast
  const toast = useToast();

  // Variable router
  const router = useRouter();

  // Variable untuk use formik
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      setTimeout(() => {
        dispatch(userLogin(values, formik.setSubmitting));
      }, 3000);
      // router.push("/profile");
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .required("This field is required")
        .min(3, "Your username has 3 character or more!"),
      password: Yup.string()
        .required("This field is required")
        .min(3, "Your password has 3 character or more!"),
    }),
    validateOnChange: true,
  });

  useEffect(() => {
    if (userSelector.id) {
      router.push("/");
    }
  }, [userSelector.id]);

  return (
    <Page title={`Login`}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        fontFamily="sans-serif"
      >
        <Box
          shadow={"dark-lg"}
          borderColor="blackAlpha.300"
          margin="10"
          width="md"
          borderWidth="thin"
          padding="2"
          borderRadius="md"
        >
          <Heading color={"dimgrey"} textAlign="center">
            LOGIN
          </Heading>

          <form>
            <FormControl isInvalid={formik.errors.username}>
              <FormHelperText>{formik.errors.username}</FormHelperText>
              {/* Input Username */}
              <Input
                onChange={(event) =>
                  formik.setFieldValue("username", event.target.value)
                }
                mb="4"
                placeholder="Username"
                id="inputUsername"
                value={formik.values.username}
              />
            </FormControl>

            <FormControl isInvalid={formik.errors.password}>
              <FormHelperText>{formik.errors.password}</FormHelperText>
              {/* Input Password */}
              <InputGroup>
                <Input
                  onChange={(event) =>
                    formik.setFieldValue("password", event.target.value)
                  }
                  type={visiblePassword ? "text" : "password"}
                  mb="4"
                  placeholder="Password"
                  id="inputPassword"
                  value={formik.values.password}
                />
                <InputRightElement
                  children={
                    <Icon
                      onClick={() => setVisiblePassword(!visiblePassword)}
                      as={visiblePassword ? IoMdEye : IoMdEyeOff}
                      sx={{ _hover: { cursor: "pointer" } }}
                    />
                  }
                />
              </InputGroup>
            </FormControl>

            <Center>
              <Button
                onClick={formik.handleSubmit}
                type="submit"
                mt="2"
                mb="4"
                width="md"
                colorScheme="facebook"
                disabled={formik.isSubmitting}
              >
                Login
              </Button>
            </Center>
          </form>
          <Divider />

          <Center>
            <Button
              onClick={() => router.push("/register")}
              marginY="4"
              width="md"
              colorScheme="green"
            >
              Register
            </Button>
          </Center>
        </Box>
      </Box>
    </Page>
  );
};

export default LoginPage;
