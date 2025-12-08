import cron from "node-cron";
import Event from "../models/Event.js";
import { sendEmail } from "../utils/sendEmail.js";

export const scheduleReminders = () => {
  cron.schedule("0 * * * *", async () => {
    // Runs every hour on minute 0
    try {
      console.log("⏳ Running reminder scheduler...");

      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find events occurring within next 24 hours
      const upcomingEvents = await Event.find({
        date: { $lte: next24Hours, $gt: now },
        participants: { $exists: true, $not: { $size: 0 } }
      }).populate("participants");

      for (const event of upcomingEvents) {
        for (const user of event.participants) {
          await sendEmail(
            user.email,
            `Reminder: ${event.title} is happening soon`,
            `Hello ${user.firstName},\n\nThis is a reminder that the event "${event.title}" will start on:\n\n📅 ${new Date(event.date).toDateString()}\n📍 ${event.location}\n\nAll the best!\n\n— Team EventureX`
          );
        }
      }

      console.log("📨 Reminder scheduler executed successfully");

    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
};
