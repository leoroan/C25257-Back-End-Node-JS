document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return window.location.href = "/login";
  }

  const name = user.username || "Usuario";
  const email = user.email || "-";

  document.getElementById("profileName").textContent = name;
  document.getElementById("profileEmail").textContent = email;
  document.getElementById("profileRole").textContent = `Rol: ${user.role}`;

  document.getElementById("profileInitial").textContent = name[0].toUpperCase();

  // document.getElementById("goHome").addEventListener("click", () => {
  //   window.location.href = "/";
  // });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/login";
  });
});
