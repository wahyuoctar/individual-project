import {
  Box,
  Avatar,
  Text,
  Image,
  Stack,
  Icon,
  Flex,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import moment from "moment";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../config/api";

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
}) => {
  const toast = useToast();

  const AlertDialogExample = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    return (
      <>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Post
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Post
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={deleteButton} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  };

  const deleteButton = async () => {
    try {
      await axiosInstance.delete("/posts/" + postId);
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

  const userSelector = useSelector((state) => state.user);
  return (
    // <Container maxW="5xl" shadow="lg" marginTop="10">
    <Flex mb={"5"}>
      <Box my="5" flex={65}>
        <Stack>
          <Link href={`/photos/${postId}`}>
            <Image width="100%" src={imageUrl} />
          </Link>
        </Stack>
      </Box>

      <Box my="5" flex={35}>
        <Flex marginLeft="6" marginTop="2">
          <Box display="flex" flexDirection="column">
            <Box mb="3" paddingX="2" display="flex" alignItems="center">
              <Avatar src={avaPic} />
              <Box marginLeft="2">
                <Text className="username" fontWeight="bold">
                  {fullName}
                </Text>
                <Text color="gray">{location}</Text>
              </Box>
            </Box>
            <Box></Box>
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

              <Text fontWeight="bold">{likes?.toLocaleString()} likes</Text>
              <Text color="gray.400" fontWeight="hairline" ml={"5"}>
                ({moment(postDate).format("MM/DD")})
              </Text>
              {/* Icon Option */}
              {postUserId == userId ? (
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
                    <MenuItem onClick={AlertDialogExample}>
                      Delete Post
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
            </Flex>

            <Text>{caption}</Text>
          </Box>
        </Flex>
        <Divider ml={"2"} />
      </Box>
    </Flex>
    // </Container>
  );
};

export default PhotosCard;
