import { API_BASE } from "./config.js";

const eventForm = document.getElementById("eventForm");
const previewImg = document.getElementById("previewImg");
const submitBtn = document.getElementById("submitBtn");
const messageEl = document.getElementById("message");
const eventId = localStorage.getItem("eventToEdit");
const token = localStorage.getItem("token");

const imageInput = document.getElementById("image");
if (imageInput && previewImg) {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      previewImg.src = URL.createObjectURL(file);
      previewImg.style.display = "block";
    }
  });
}

if (eventId) {
  submitBtn.textContent = "Update Event";

  (async function loadEditEvent() {
    try {
      const res = await fetch(`${API_BASE}/events`);
      const data = await res.json();
      const event = (data.data || []).find((e) => e._id === eventId);

      if (event) {
        document.getElementById("title").value = event.title;
        document.getElementById("description").value = event.description;
        document.getElementById("date").value = event.date.split("T")[0];
        document.getElementById("location").value = event.location;
        document.getElementById("category").value = event.category;
        if (event.imageUrl) {
          previewImg.src = event.imageUrl;
          previewImg.style.display = "block";
        }
      }
    } catch (err) {
      console.error("Failed to load event:", err);
    }
  })();
}

eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("date", document.getElementById("date").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("category", document.getElementById("category").value);

  const file = document.getElementById("image").files[0];
  if (file) formData.append("image", file);

  const endpoint = eventId ? `${API_BASE}/events/${eventId}` : `${API_BASE}/events`;
  const method = eventId ? "PUT" : "POST";

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.success) {
      messageEl.textContent = eventId ? "Event updated successfully!" : "Event created successfully!";
      messageEl.style.color = "lightgreen";

      localStorage.removeItem("eventToEdit");
      setTimeout(() => (window.location.href = "admin-dashboard.html"), 1000);
    } else {
      messageEl.textContent = data.message || "Failed to save event";
      messageEl.style.color = "salmon";
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Server error";
    messageEl.style.color = "salmon";
  }
});
