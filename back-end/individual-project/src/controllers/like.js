const { Like, User, Post } = require("../lib/sequelize");

const likeControllers = {
    getPostLike: async(req, res) => {
        try {
            const {postId} = req.params
            const user_id = req.token.user_id
            // const {user_id} =req.body

            const findLike = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (!findLike) {
                return res.status(400).json({
                    message: "Can't find Like"
                })
            }

            return res.status(200).json({
                message: "Find Successfully!",
                result: findLike
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    likePost: async(req, res) => {
        try {
            const {postId} = req.params
            // const {user_id} = req.body
            const user_id = req.token.user_id

            const findPost = await Post.findAll({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Can't find this Post!"
                })
            }

            const findUserLike = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (findUserLike) {
                return res.status(400).json({
                    message: "You Already Like This Post!"
                })
            }

            const likePost = await Like.create({
                post_id: postId,
                user_id
            })

            await Post.increment({
                like_count: 1
            },
            {
                where: {
                    id: postId,
                }
            })

            return res.status(200).json({
                message: "You Like This Post",
                result: likePost
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    unlikePost: async(req, res) => {
        try {
            const {postId} = req.params
            // const {user_id} = req.body
            const user_id = req.token.user_id

            const findPost = await Post.findAll({
                where: {
                    id: postId
                }
            })

            const findUserLike = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Can't find this Post!"
                })
            }

            if (!findUserLike) {
            return res.status(400).json({
                message: "You Already Unlike This Post!"
            })}

            await Post.decrement({
                like_count: 1
            }, {
                where: {
                    id: postId,
                }
            })

            await Like.destroy({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            return res.status(200).json({
                message: "Unlike Post Successfully!"
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    }

}

module.exports = likeControllers