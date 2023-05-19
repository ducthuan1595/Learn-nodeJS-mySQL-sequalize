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
          subject: "Hếlô ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<di><img src='https://media.makeameme.org/created/stupid-people-everywhere-awkmh6.jpg' /><hr></di><b>You are a Fool?</b></div>", // html body
        }
        const info = await transporter.sendMail(options)
        callback(info);
      } catch (error) {
        console.log(error);
      } 
    };

    module.exports = sendMailer;

    // send mail with defined transport object
    


