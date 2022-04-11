const userControllers = require("../controllers/user")
const fileUploader = require("../lib/uploader")


const router = require("express").Router()

router.get("/", userControllers.getAllUser)

router.post("/", fileUploader({
    destinationFolder: "avatars",
    prefix: "AVATAR",
    fileType: "image"
}).single("ava_pic_file"), userControllers.createNewUser)

router.patch("/:userId", fileUploader({
    destinationFolder: "avatars",
    prefix: "AVATAR",
    fileType: "image"
}).single("ava_pic_file"), userControllers.editUser)

module.exports = router