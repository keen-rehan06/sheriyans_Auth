
import dotenv from "dotenv";
dotenv.config({path:"./.env"})

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

console.log(process.env.MAIL_USER)
console.log(process.env.MAIL_PASS)

export const verifyEmail = async (token, email) => {
  try {
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf-8"
    );

    const template = handlebars.compile(emailTemplateSource);

    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: htmlToSend,
    };

    const response = await transport.sendMail(mailOptions);

    console.log("Email sent:", response.messageId);

    return response;
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
};