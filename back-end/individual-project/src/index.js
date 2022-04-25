const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const { userRoutes, postRoutes, authRoutes, commentRoutes } = require("./routes")
const { sequelize } = require("./lib/sequelize")
sequelize.sync({alter: true})

const PORT = process.env.PORT



app.use(express.json())
app.use(cors())

app.use("/image_url", express.static(`${__dirname}/public/posts`))
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/auth", authRoutes)
app.use("/comments", commentRoutes)

app.listen(PORT, () => {
    console.log(`Listening in PORT: `, PORT);
})
