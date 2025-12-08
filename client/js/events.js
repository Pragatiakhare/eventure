import { API_BASE } from "./config.js";

document.addEventListener("DOMContentLoaded", loadUpcomingEvents);

async function loadUpcomingEvents() {
  const container = document.getElementById("eventsContainer");
  if (!container) return;

  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`${API_BASE}/events/upcoming`);
    const data = await res.json();
    const events = data.data || [];

    container.innerHTML = "";

    events.forEach((event) => {
      const registered = event.participants?.includes(userId);

      const card = document.createElement("div");
      card.classList.add("event-card");

      card.innerHTML = `
        ${event.imageUrl ? `<img src="${event.imageUrl}" class="event-image" alt="Event Banner" />` : ""}

        <div class="event-content">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-desc">${event.description}</p>
          <p class="event-meta"><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
          <p class="event-meta"><strong>Location:</strong> ${event.location}</p>

          <button
            class="register-btn ${registered ? "registered-btn" : ""}"
            data-id="${event._id}"
            ${registered ? "disabled" : ""}
          >
            ${registered ? "Registered ✓" : "Register"}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("EVENT LOAD ERROR:", err);
  }
}

// REGISTER
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("register-btn")) return;

  const eventId = e.target.dataset.id;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to register.");
    return (window.location.href = "login.html");
  }

  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (res.ok) {
      e.target.textContent = "Registered ✓";
      e.target.disabled = true;
      e.target.classList.add("registered-btn");
    }
    alert(result.message);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    alert("Something went wrong");
  }
});
