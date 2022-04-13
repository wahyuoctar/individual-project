const authControllers = require("../controllers/auth")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)

router.get("/verify/:token", authControllers.verifyUser)

module.exports = router