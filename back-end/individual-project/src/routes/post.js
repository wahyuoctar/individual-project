const postControllers = require("../controllers/post")

const router = require("express").Router()

router.get("/", postControllers.getAllPosts)
router.post("/", postControllers.createNewPost)

module.exports = router