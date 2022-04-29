const likeControllers = require("../controllers/like")
const { authorizedLoggedInUser } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.get("/post/:postId", authorizedLoggedInUser, likeControllers.getPostLike)
router.post("/post/:postId", authorizedLoggedInUser, likeControllers.likePost)
router.delete("/post/:postId", authorizedLoggedInUser, likeControllers.unlikePost)

module.exports = router