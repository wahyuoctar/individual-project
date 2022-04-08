const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const { userRoutes } = require("./routes")
const { sequelize } = require("./lib/sequelize")
sequelize.sync({alter: true})

const PORT = process.env.PORT



app.use(express.json())
app.use(cors())

app.use("/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Listening in PORT: `, PORT);
})
