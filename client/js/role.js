import { API_BASE } from "./config.js";

// Inject navbar
const navbarMount = document.getElementById("navbar");
if (navbarMount) {
  fetch("components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      navbarMount.innerHTML = html;

      const role = localStorage.getItem("role");
      if (role === "admin") {
        const adminLink = document.getElementById("adminLink");
        if (adminLink) adminLink.style.display = "block";
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "index.html";
        });
      }
    });
}

// Route protection
const protectedPages = [
  "student-home.html",
  "events.html",
  "past-events.html",
  "admin-dashboard.html",
  "add-event.html",
];

const adminPages = ["admin-dashboard.html", "add-event.html"];

const currentPage = location.pathname.split("/").pop();
if (protectedPages.includes(currentPage)) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  } else {
    const role = localStorage.getItem("role");
    if (adminPages.includes(currentPage) && role !== "admin") {
      window.location.href = "student-home.html";
    }
  }
}
