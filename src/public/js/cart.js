(function () {
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
    return cart;
  }

  function cartTotalItems(cart = getCart()) {
    return cart.reduce((acc, p) => acc + (Number(p.qty) || 0), 0);
  }

  function updateCartCount() {
    const countEl = document.getElementById("cartBadge");
    if (!countEl) return;
    const total = cartTotalItems();
    countEl.textContent = total;
  }

  function findItemIndex(cart, id) {
    return cart.findIndex(i => String(i.id) === String(id));
  }

  window.addToCart = function addToCart(id, name, price, image) {
    const cart = getCart();
    const idx = findItemIndex(cart, id);

    if (idx > -1) {
      cart[idx].qty = Number(cart[idx].qty || 0) + 1;
    } else {
      cart.push({
        id: String(id),
        name,
        price: Number(price) || 0,
        image,
        qty: 1
      });
    }

    setCart(cart);
    showToast(`${name} agregado al carrito`);
  };

  window.changeQty = function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Number(cart[index].qty || 0) + Number(delta || 0);
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    setCart(cart);
  };

  window.removeItem = function removeItem(index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    setCart(cart);
  };


  document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("cartContent");
    const loader = document.getElementById("cartLoading");

    // Simulamos breve carga (queda más estético)
    setTimeout(() => {
      loader.style.display = "none";
      content.style.display = "block";
      renderCart();
    }, 500);

    // Init de toasts
    if (!document.getElementById("toastContainer")) {
      const tc = document.createElement("div");
      tc.id = "toastContainer";
      tc.style.position = "fixed";
      tc.style.right = "1rem";
      tc.style.bottom = "1rem";
      tc.style.zIndex = 1080;
      document.body.appendChild(tc);
    }
  });


  function renderCart() {
    const cart = getCart();
    const tbody = document.querySelector("#cartTable tbody");
    const totalEl = document.getElementById("cartTotal");

    if (!tbody) {
      updateCartCount();
      if (totalEl) totalEl.textContent = "0.00";
      return;
    }

    tbody.innerHTML = "";
    let sum = 0;

    cart.forEach((p, i) => {
      const price = Number(p.price) || 0;
      const qty = Number(p.qty) || 0;
      const sub = price * qty;
      sum += sub;

      tbody.innerHTML += `
        <tr>
          <td class="align-middle">
            <div class="d-flex align-items-center gap-2">
              <img src="${p.image || ''}" alt="${escapeHtml(p.name)}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
              <div>
                <div>${escapeHtml(p.name)}</div>
                <small class="text-muted">${p.id}</small>
              </div>
            </div>
          </td>
          <td class="align-middle">$${price.toFixed(2)}</td>
          <td class="align-middle">
            <div class="btn-group btn-group-sm" role="group" aria-label="qty">
              <button class="btn btn-outline-secondary" onclick="changeQty(${i}, -1)">-</button>
              <span class="px-2 align-middle">${qty}</span>
              <button class="btn btn-outline-secondary" onclick="changeQty(${i}, 1)">+</button>
            </div>
          </td>
          <td class="align-middle">$${sub.toFixed(2)}</td>
          <td class="align-middle">
            <button class="btn btn-sm btn-danger" onclick="removeItem(${i})"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    });

    if (totalEl) totalEl.textContent = sum.toFixed(2);
    updateCartCount();
  }

  window.checkout = async function checkout() {
    const cart = getCart();
    if (!cart.length) return showToast("Tu carrito está vacío", "warning");

    const btn = document.getElementById("checkoutBtn");
    const label = btn.querySelector(".label");
    const spinner = btn.querySelector(".spinner-border");

    // Activar spinner
    btn.disabled = true;
    label.textContent = "Procesando...";
    spinner.classList.remove("d-none");

    const orderNumber = Math.floor(Math.random() * 1000000);

    const userJson = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    let backendOk = false;

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        const res = await fetch(`http://localhost:8081/api/v1/auth/${user.id}/save-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ cart: [] })
        });
        backendOk = res.ok;
      } catch (err) {
        console.warn("No se pudo actualizar carrito en backend:", err);
      }
    }

    localStorage.removeItem("cart");
    setCart([]);

    // Desactivar spinner
    btn.disabled = false;
    label.textContent = "Finalizar Compra";
    spinner.classList.add("d-none");

    if (backendOk) {
      showToast(`Compra exitosa! N° operación: ${orderNumber}`, "success");
    } else {
      showToast(`Compra realizada (offline). N° operación: ${orderNumber}`, "info");
    }
  };


  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (container) {
      const toast = document.createElement("div");
      toast.className = `toast align-items-center text-bg-${type} border-0`;
      toast.setAttribute("role", "alert");
      toast.setAttribute("aria-live", "assertive");
      toast.setAttribute("aria-atomic", "true");
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
      container.appendChild(toast);
      const bsToast = new bootstrap.Toast(toast, { delay: 2500 });
      bsToast.show();
      toast.addEventListener('hidden.bs.toast', () => toast.remove());
      return;
    }

    alert(message);
  }

  function escapeHtml(unsafe) {
    if (unsafe == null) return "";
    return String(unsafe)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Render inicial al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    if (!document.getElementById("toastContainer")) {
      const tc = document.createElement("div");
      tc.id = "toastContainer";
      tc.style.position = "fixed";
      tc.style.right = "1rem";
      tc.style.bottom = "1rem";
      tc.style.zIndex = 1080;
      document.body.appendChild(tc);
    }
  });

  window.getCart = getCart;
  window.setCartLocal = setCart;
})();
