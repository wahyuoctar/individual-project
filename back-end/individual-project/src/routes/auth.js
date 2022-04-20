const authControllers = require("../controllers/auth")
const { authorizedLoggedInUser } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)

router.get("/verify/:token", authControllers.verifyUser)
router.get("/update-token", authorizedLoggedInUser, authControllers.keepLogin)

module.exports = router