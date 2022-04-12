const { Post, User } = require("../lib/sequelize")

const postControllers = {
    getAllPosts: async (req, res) => {
        try {
            const findAllPosts = await Post.findAll({
                include: [
                    {
                        model: User
                    }
                ]
            })

            return res.status(200).json({
                message: "We Found All Posts!",
                result: findAllPosts
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    createNewPost: async (req, res) => {
        try {
            const { caption, location, user_id, image_url } = req.body
            // const {filename} = req.file

            // const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            // const filePath = "image_url"

            const findUser = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if (!findUser) {
                return res.status(400).json({
                    message: "User not Found!"
                })
            }

            const postCreated = await Post.create({
                caption,
                location,
                user_id,
                image_url
            })

            return res.status(201).json({
                message: "Post Added",
                result: postCreated
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    getPostById: async (req, res) => {
        try {
            const {postId} = req.params
            const findPost = await Post.findOne({
                where: {
                    id: postId
                },
                include: [
                    {
                        model: User
                    }
                ]
            })

            return res.status(200).json({
                message: `We Found Post ID: ${postId} !`,
                result: findPost
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    }
}

module.exports = postControllers