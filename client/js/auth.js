import { API_BASE } from "./config.js";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// SIGNUP
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    const userData = {
      name: `${firstName} ${lastName}`,
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      window.location.href = "login.html";
    }
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("name", data.user.name);

    if (data.user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "student-home.html";
    }
  });
}
