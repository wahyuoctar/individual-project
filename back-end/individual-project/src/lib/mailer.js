const nodemailer = require("nodemailer")

const mailer = async ({
    subject,
    to,
    text,
    html
}) => {
    const transport = nodemailer.createTransport({
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        },
        host: "smtp.gmail.com"
    })

    await transport.sendMail({
        subject: subject || "Verify Your Account!",
        to: to || "wahyuoctar@gmail.com",
        text: text || "Hey, You're almost ready to start enjoying. Please verify your account.",
        html: html || "<h1>Verify Your Account</h1>",
      })
}

module.exports = mailer