"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        // type: "OAuth2",
        user: process.env.ADDRESS_EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    const sendMailer = async (email, callback) => {
      try {
        const options = {
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>You are a Fool?</b>", // html body
        }
        const info = await transporter.sendMail(options)
        callback(info);
      } catch (error) {
        console.log(error);
      } 
    };

    module.exports = sendMailer;

    // send mail with defined transport object
    


