import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const user = process.env.GMAIL_ACCOUNT;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  throw new Error("Gmail credentials not set in environment variables");
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

/**
 * General email sender
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"XIKHub" <${user}>`,
      to,
      subject,
      text, // plain-text fallback (IMPORTANT)
      html, // optional HTML version
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
