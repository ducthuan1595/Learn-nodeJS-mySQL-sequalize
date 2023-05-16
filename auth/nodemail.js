"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

    let transporter = nodemailer.createTransport({
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

    let options = () => {
      const option ={
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'hi.tim.gi.the@gmail.com', // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>I am a Foo?</b>", // html body
      }
      return option;
    };

    const sendMailer = async (email, callback) => {
      try {
        const options = {
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>You are a Foo?</b>", // html body
        }
        const info = await transporter.sendMail(options)
        callback(info);
      } catch (error) {
        console.log(error);
      } 
    };

    module.exports = sendMailer;

    // send mail with defined transport object
    


