import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// ================= CREATE EVENT (ADMIN) ==================
export const createEvent = async (req, res) => {
  try {
    const eventDate = new Date(req.body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past."
      });
    }

    const imageUrl = req.file
      ? req.file.path  // Cloudinary path from multer middleware
      : null;

    const newEvent = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      category: req.body.category,
      imageUrl,
      isPast: false,
      participants: []
    });

    // SEND EMAIL TO ALL USERS ABOUT NEW EVENT
    const users = await User.find({}, "email firstName lastName");
    users.forEach(async (user) => {
      await sendEmail(
        user.email,
        `New Event: ${newEvent.title}`,
        `Hello ${user.firstName},\n\nA new event "${newEvent.title}" has been announced!\n\n📍 Location: ${newEvent.location}\n📅 Date: ${new Date(newEvent.date).toDateString()}\n\nVisit EventureX portal to Register!\n\n— Team EventureX`
      );
    });

    return res.status(201).json({ success: true, data: newEvent });

  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= REGISTER FOR EVENT (STUDENT) ==================
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already registered" });
    }

    event.participants.push(userId);
    await event.save();

    // Send confirmation email
    await sendEmail(
      req.user.email,
      `Registration Confirmed: ${event.title}`,
      `Hello ${req.user.firstName},\n\nYou have successfully registered for "${event.title}".\nDate: ${new Date(event.date).toDateString()}\nLocation: ${event.location}\n\nAll the best!\n\n— Team EventureX`
    );

    return res.status(200).json({ success: true, message: "Registered Successfully!" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET ALL EVENTS ==================
export const getAllEvents = async (req, res) => {
  try {
    const today = new Date();
    await Event.updateMany(
      { date: { $lt: today }, isPast: false },
      { $set: { isPast: true } }
    );

    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPCOMING EVENTS ==================
export const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    await Event.updateMany(
      { date: { $lt: today }, isPast: false },
      { $set: { isPast: true } }
    );

    const upcomingEvents = await Event
      .find({ isPast: false })
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: upcomingEvents });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= PAST EVENTS ==================
export const getPastEvents = async (req, res) => {
  try {
    const pastEvents = await Event
      .find({ isPast: true })
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: pastEvents });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= DELETE EVENT ==================
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Event deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE EVENT ==================
export const updateEvent = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) updates.imageUrl = req.file.path;

    const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
