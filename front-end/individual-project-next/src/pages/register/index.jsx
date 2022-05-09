import {
  Heading,
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import Page from "../../components/Page";
import Link from "next/link";
import { userRegister } from "../../redux/actions/auth";

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);

  // Berfungsi untuk memastikan apakah user sudah login apa belum
  const authSelector = useSelector((state) => state.auth);
  const userSelector = useSelector((state) => state.user);

  // Menghandle inputan tanpa useState
  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      password: "",
      repeatPassword: "",
      email: "",
    },
    onSubmit: (values) => {
      setTimeout(() => {
        dispatch(userRegister(values, formik.setSubmitting));
        formik.setFieldValue("fullname", "");
        formik.setFieldValue("username", "");
        formik.setFieldValue("password", "");
        formik.setFieldValue("repeatPassword", "");
        formik.setFieldValue("email", "");
        router.push("/login");
      }, 3000);
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string().required("This field is required"),
      username: Yup.string()
        .required("This field is required")
        .min(3, "Your username has to be at least 3 characters"),
      password: Yup.string()
        .required("This field is required")
        .min(8, "Weak Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Number and One Symbol"
        ),
      repeatPassword: Yup.string()
        .required("This field is required")
        .oneOf([Yup.ref("password"), null], "Password Must Match"),
      email: Yup.string()
        .required("This field is required")
        .email("Please use a valid email"),
    }),
  });

  if (authSelector.id || userSelector.id) {
    router.push("/");
  }

  return (
    <Page title={`Register`}>
      <Center>
        <Box
          fontFamily="sans-serif"
          borderRadius="md"
          py="2"
          mt="2"
          shadow="dark-lg"
          width="lg"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Heading color={"cadetblue"} textAlign="center">
            REGISTER
          </Heading>
          <Box width="md">
            <form>
              <FormControl isInvalid={formik.errors.fullname}>
                <FormLabel htmlFor="inputFullname">Fullname</FormLabel>
                <FormHelperText>{formik.errors.fullname}</FormHelperText>
                <Input
                  onChange={(event) =>
                    formik.setFieldValue("fullname", event.target.value)
                  }
                  mb="3"
                  id="inputFullname"
                  value={formik.values.fullname}
                />
              </FormControl>

              <FormControl isInvalid={formik.errors.username}>
                <FormLabel htmlFor="inputUsername">Username</FormLabel>
                <FormHelperText>{formik.errors.username}</FormHelperText>
                <Input
                  onChange={(event) =>
                    formik.setFieldValue("username", event.target.value)
                  }
                  mb="3"
                  id="inputUsername"
                  value={formik.values.username}
                />
              </FormControl>

              <FormControl isInvalid={formik.errors.email}>
                <FormLabel htmlFor="inputEmail">Email</FormLabel>
                <FormHelperText>{formik.errors.email}</FormHelperText>
                <Input
                  type="email"
                  onChange={(event) =>
                    formik.setFieldValue("email", event.target.value)
                  }
                  id="inputEmail"
                  value={formik.values.email}
                />
              </FormControl>

              <FormControl isInvalid={formik.errors.password}>
                <FormLabel htmlFor="inputPassword">Password</FormLabel>
                <FormHelperText>{formik.errors.password}</FormHelperText>
                <InputGroup>
                  <Input
                    type={visiblePassword ? "text" : "password"}
                    onChange={(event) =>
                      formik.setFieldValue("password", event.target.value)
                    }
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

              <FormControl isInvalid={formik.errors.repeatPassword}>
                <FormLabel htmlFor="inputRepeatPassword">
                  Repeat Password
                </FormLabel>
                <FormHelperText>{formik.errors.repeatPassword}</FormHelperText>
                <InputGroup>
                  <Input
                    type={visibleRepeatPassword ? "text" : "password"}
                    onChange={(event) =>
                      formik.setFieldValue("repeatPassword", event.target.value)
                    }
                    id="inputRepeatPassword"
                    value={formik.values.repeatPassword}
                  />
                  <InputRightElement
                    children={
                      <Icon
                        onClick={() =>
                          setVisibleRepeatPassword(!visibleRepeatPassword)
                        }
                        as={visibleRepeatPassword ? IoMdEye : IoMdEyeOff}
                        sx={{ _hover: { cursor: "pointer" } }}
                      />
                    }
                  />
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                width="md"
                onClick={formik.handleSubmit}
                mt="2"
                colorScheme="green"
                disabled={formik.isSubmitting}
              >
                Register
              </Button>
            </form>
            <Divider />
            <Link href={`/login`}>
              <Button mt="2" width="md" colorScheme="blue">
                Login
              </Button>
            </Link>
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default RegistrationPage;
