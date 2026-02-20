const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message;
      errorMsg.classList.remove("hidden");
      return;
    }

   
    localStorage.setItem("token", data.token);
    window.location.href = "admin.html";

  } catch (err) {
    errorMsg.textContent = "Server error. Try again.";
    errorMsg.classList.remove("hidden");
  }
});
