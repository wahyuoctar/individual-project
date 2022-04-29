const { Like, User, Post } = require("../lib/sequelize");

const likeControllers = {
    getPostLike: async(req, res) => {
        try {
            const {postId} = req.params

            const findLike = await Like.findAll({
                where: {
                    post_id: postId
                },
                include: [
                    {model : User}
                ]
            })

            if (!findLike) {
                return res.status(400).json({
                    message: "Can't find Post"
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

    likeUnlikePost: async(req, res) => {
        try {
            const {postId} = req.params
            const {user_id} = req.body
            // const user_id = req.token.user_id

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

            const findUserLike = await Like.findAll({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (!findUserLike) {
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
                    message: "You already Unlike this Post!"
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
    }

}

module.exports = likeControllers