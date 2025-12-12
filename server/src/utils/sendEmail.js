// server/src/utils/sendEmail.js
import dotenv from "dotenv";
import { Resend } from "resend";

// Load .env variables
dotenv.config();

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in .env file!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || "EventureX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", response);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};
