const commentControllers = require("../controllers/comment")

const router = require("express").Router()


// Get Comment by PostId
router.get("/post/:postId", commentControllers.getPostComments)
router.post("/post/:postId", commentControllers.addPostComment)

module.exports = router