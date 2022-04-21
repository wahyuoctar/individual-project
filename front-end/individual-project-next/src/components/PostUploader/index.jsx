import { Box, Text, Input, Button, useToast, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRef, useState, useEffect } from "react";

const PostUploader = () => {
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      caption: "",
      location: "",
    },
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const inputFile = useRef(null);

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    alert(event.target.files[0].name);
  };

  const uploadHandler = async () => {
    if (!selectedFile) {
      alert("Select your Image First!");
      return;
    }

    const formData = new FormData();
    const { caption, location } = formik.values;

    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("user_id", userSelector.id);
    formData.append("image_url", selectedFile);

    try {
      await axiosInstance.post("/posts", formData);
      setSelectedFile(null);
      formik.setFieldValue("caption", "");
      formik.setFieldValue("location", "");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box padding="2" my="4" width="xl" borderRadius="md">
      <Text textShadow="1px 1px #ff0000" as="h3" fontWeight="bold">
        Please share your moment here!
      </Text>
      <Input
        onChange={(event) =>
          formik.setFieldValue("caption", event.target.value)
        }
        placeholder="Caption..."
      />
      <Input
        onChange={(event) =>
          formik.setFieldValue("location", event.target.value)
        }
        mt={"2"}
        placeholder="Location..."
      />

      <Flex my="2" justifyContent="space-between">
        <Input
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFile}
          ref={inputFile}
          type="file"
          display="none"
        />
        <Button
          onClick={() => inputFile.current.click()}
          width="50%"
          mr="1"
          colorScheme="facebook"
        >
          Upload File
        </Button>
        <Button onClick={uploadHandler} width="50%" colorScheme="green">
          Post
        </Button>
      </Flex>
    </Box>
  );
};
export default PostUploader;
