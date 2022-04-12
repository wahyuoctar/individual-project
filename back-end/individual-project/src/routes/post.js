const postControllers = require("../controllers/post")

const router = require("express").Router()

// Get All Post
router.get("/", postControllers.getAllPosts)

// Create New Post
router.post("/", postControllers.createNewPost)

// Get Post Detail
router.get("/:postId", postControllers.getPostById)




module.exports = router