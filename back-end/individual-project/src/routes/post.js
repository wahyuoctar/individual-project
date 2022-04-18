const postControllers = require("../controllers/post")
const fileUploader = require("../lib/uploader")


const router = require("express").Router()

// Get All Post
router.get("/", postControllers.getAllPosts)

// Create New Post
router.post("/", fileUploader({
destinationFolder: "posts",
prefix: "POST",
fileType: "image"
}).single("image_url"), 
postControllers.createNewPost)

// Get Post Detail
router.get("/:postId", postControllers.getPostById)
router.get("/user/:userId", postControllers.getPostByUserId)

router.get("/:postId/comments", postControllers.getPostComments)
router.post("/:postId/comments", postControllers.addPostComment)



module.exports = router