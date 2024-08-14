// import nodemailer from "nodemailer";

const nodemailer = require("nodemailer");

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Send email function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
// @ts-ignore
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order");
