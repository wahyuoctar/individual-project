const postControllers = require("../controllers/post")
const fileUploader = require("../lib/uploader")
const { authorizedLoggedInUser } = require("../middlewares/authMiddleware")


const router = require("express").Router()

// Get All Post
router.get("/", postControllers.getAllPosts)

// Create New Post
router.post("/", authorizedLoggedInUser, 
fileUploader({
destinationFolder: "posts",
prefix: "POST",
fileType: "image"
}).single("image_url"), 
postControllers.createNewPost)

// Edit Post
router.patch("/:postId", authorizedLoggedInUser, postControllers.editPost)

// Delete Post
router.delete("/:postId", authorizedLoggedInUser, postControllers.deletePost)

// Get Post Detail
router.get("/:postId", postControllers.getPostById)
router.get("/user/:userId", postControllers.getPostByUserId)




module.exports = router