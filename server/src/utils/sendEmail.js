// server/src/utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "EventureX <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("Email sent successfully via Resend");
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};
