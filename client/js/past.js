import { API_BASE } from "./config.js";

async function loadPastEvents() {
  const container = document.getElementById("pastEventsContainer");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/events/past`);
    const data = await res.json();
    const events = data.data || [];

    container.innerHTML = "";

    events.forEach((event) => {
      const card = document.createElement("div");
      card.classList.add("event-card");

      card.innerHTML = `
        ${event.imageUrl ? `<img src="${event.imageUrl}" class="event-image" alt="Event Banner" />` : ""}

        <div class="event-content">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-desc">${event.description}</p>
          <p class="event-meta"><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
          <p class="event-meta"><strong>Location:</strong> ${event.location}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

loadPastEvents();
