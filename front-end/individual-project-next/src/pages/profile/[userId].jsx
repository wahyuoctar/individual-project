// import {
//   Avatar,
//   Text,
//   Divider,
//   Input,
//   Button,
//   Flex,
//   Container,
//   Box,
//   useToast,
// } from "@chakra-ui/react";
// import { useRef, useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { axiosInstance } from "../../config/api";
// import PhotosCard from "../../components/PhotosCard";
// import { useFormik } from "formik";
// import { useRouter } from "next/router";
// import { fetchUserData } from "../../redux/actions/auth";
// import requiresAuth from "../../lib/hoc/requiresAuth";
// import Page from "../../components/Page";
// import Profile from "../../components/Profile";
// import PostUploader from "../../components/PostUploader";
// import axios from "axios";

// const ProfilePage = ({ photosDetail, userData }) => {
//   //   const [posts, setPosts] = useState([]);
//   //   const [userData, setUserData] = useState([]);

//   //   const userSelector = useSelector((state) => state.user);

//   //   const dispatch = useDispatch();
//   //   const router = useRouter();

//   //   const fetchPosts = async () => {
//   //     try {
//   //       const { userId } = router.params;
//   //       const res = await axiosInstance.get("/posts/user/" + userId);

//   //       setPosts(res?.data?.result);
//   //       setUserData(res?.data?.result[1]?.User);
//   //       console.log(res.data.result);
//   //     } catch (err) {
//   //       console.log(err.message);
//   //     }
//   //   };

//   const renderPosts = () => {
//     return photosDetail.map((val) => {
//       return (
//         <PhotosCard
//           fullName={val?.User?.fullname || "Fullname"}
//           avaPic={val?.User?.ava_pic}
//           caption={val?.caption}
//           likes={val?.like_count}
//           location={val?.location}
//           imageUrl={val?.image_url}
//           id={val?.id}
//           postDate={val?.createdAt}
//           isInProfile={true}
//         />
//       );
//     });
//   };

//   //   useEffect(() => {
//   //     if (userSelector.id) {
//   //       dispatch(fetchUserData());
//   //       fetchPosts();
//   //     }
//   //   }, [userSelector.id]);

//   //   console.log(posts);

//   return (
//     <Page title={`My Profile`}>
//       <Container borderRadius="md" minW="5xl" shadow="dark-lg" marginTop="10">
//         <Box py="4" alignItems="center" display="flex" flexDirection="column">
//           <Profile
//             avaPic={userData?.ava_pic}
//             fullName={userData?.fullname}
//             biography={userData?.biography}
//             currentCity={userData?.current_city}
//             followers={userData?.followers}
//             following={userData?.following}
//             posts={userData?.posts}
//           />
//           <Divider />
//         </Box>
//         <Box>{renderPosts()}</Box>
//       </Container>
//     </Page>
//   );
// };

// export async function getServerSideProps(context) {
//   const { userId } = context.params;

//   const res = await axios.get(`http://localhost:2000/posts/user/${userId}`);

//   return {
//     props: {
//       photosDetail: res?.data?.result,
//       userData: res?.data?.result[1]?.User,
//     },
//   };
// }

// export default ProfilePage;
