const userControllers = require("../controllers/user")

const router = require("express").Router()

router.get("/", userControllers.getAllUser)
router.post("/", userControllers.createNewUser)

module.exports = router