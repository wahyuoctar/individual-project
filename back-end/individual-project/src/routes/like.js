const likeControllers = require("../controllers/like")

const router = require("express").Router()

router.get("/post/:postId", likeControllers.getPostLike)
router.post("/post/:postId", likeControllers.likePost)
router.delete("/post/:postId", likeControllers.unlikePost)

module.exports = router