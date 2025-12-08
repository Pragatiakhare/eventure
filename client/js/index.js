import { API_BASE } from "./config.js";

async function loadTrendingEvents() {
  try {
    let response = await fetch(`${API_BASE}/events/upcoming`);
    let result = await response.json();

    if (!result.data || result.data.length === 0) {
      response = await fetch(`${API_BASE}/events/past`);
      result = await response.json();
    }

    const slider = document.getElementById("trendingSlider");
    if (!slider) return;

    slider.innerHTML = "";

    (result.data || []).slice(0, 8).forEach((event) => {
      const card = document.createElement("div");
      card.classList.add("trend-card");

      card.innerHTML = `
        ${event.imageUrl ? `<img src="${event.imageUrl}" alt="Event Image"/>` : ""}
        <h3>${event.title}</h3>
        <p>${new Date(event.date).toDateString()}</p>
      `;

      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading trending:", err);
  }
}

loadTrendingEvents();

document.getElementById("slideLeft")?.addEventListener("click", () => {
  document.getElementById("trendingSlider").scrollLeft -= 350;
});
document.getElementById("slideRight")?.addEventListener("click", () => {
  document.getElementById("trendingSlider").scrollLeft += 350;
});
