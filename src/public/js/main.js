// --- CARRITO GLOBAL ---
window.getCart = function () {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

window.saveCart = function (cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = function (id, name, price, image) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else cart.push({ id, name, price, image, qty: 1 });
  saveCart(cart);

  const total = cart.reduce((sum, p) => sum + p.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

function logout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (user && token && cart.length) {
    fetch(`http://localhost:8081/api/v1/auth/${user.id}/save-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ cart })
    }).catch(() => console.warn("No se pudo guardar el carrito"));
  }

  localStorage.clear();
  window.location.href = "/login";
}

// GLOBAL TOAST MAKER
window.showToast = function (message, type = "success", action = null) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.role = "alert";
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
        ${action ? `<div class="mt-2 pt-2 border-top">${action}</div>` : ""}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 2500 });
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", () => toast.remove());
};

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.getElementById("navItems");
  const user = localStorage.getItem("user");

  if (!navItems) return;

  if (!user) {
    navItems.style.display = "none";   // Oculta todo el menú
  } else {
    navItems.style.display = "flex";   // Lo muestra normalmente
  }
});

