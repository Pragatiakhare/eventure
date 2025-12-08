import { API_BASE } from "./config.js";

async function loadAdminEvents() {
  const tbody = document.getElementById("adminEventsBody");
  if (!tbody) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const events = data.data || [];
    tbody.innerHTML = "";

    events.forEach((ev) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ev.title}</td>
        <td>${new Date(ev.date).toDateString()}</td>
        <td>${ev.location}</td>
        <td>${ev.category}</td>
        <td>
          <button class="action-btn action-edit" onclick="editEvent('${ev._id}')">Edit</button>
          <button class="action-btn action-delete" onclick="deleteEvent('${ev._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

window.deleteEvent = async function (id) {
  if (!confirm("Are you sure you want to delete this event?")) return;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert("Event deleted");
      loadAdminEvents();
    } else {
      alert(data.message || "Delete failed");
    }
  } catch (err) {
    console.error(err);
  }
};

window.editEvent = function (id) {
  localStorage.setItem("eventToEdit", id);
  window.location.href = "add-event.html";
};

loadAdminEvents();
