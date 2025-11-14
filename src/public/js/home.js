document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    document.getElementById("btnOpenCreate").classList.remove("d-none");
  }

  const list = document.getElementById("productList");

  list.innerHTML = `
    <div class="d-flex justify-content-center my-5 w-100">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
    <span class="visually-hidden">Cargando...</span>
    </div>
    </div>  
  `;

  try {
    const res = await fetch("http://localhost:8081/api/v1/products");;

    if (!res.ok) {
      throw new Error("Error al obtener productos");
    }

    const products = await res.json();

    list.innerHTML = "";

    const fragment = document.createDocumentFragment();

    products.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-lg-3 mb-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm rounded-3 border-0 product-card">
          
          <img src="${p.image}" 
               class="card-img-top rounded-top-3" 
               alt="${escapeHTML(p.name)}"
               style="height:200px; object-fit:cover;">
          
          <div class="card-body d-flex flex-column p-3">
          
            <h5 class="card-title text-truncate mb-2">${escapeHTML(p.name)}</h5>
            <p class="card-text text-muted small mb-2 flex-grow-1">${escapeHTML(p.description)}</p>
          
            <div class="mt-auto pt-2">
              <p class="text-center mb-2"><strong class="text-success">$${p.price}</strong></p>
          
              <button class="btn btn-outline-success w-100 py-2 mb-2"
                onclick="addToCartHome('${p.id}', '${escapeHTML(p.name)}', ${p.price}, '${escapeHTML(p.image)}')">
                <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
              </button>
          
              ${isAdmin ? `
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-warning flex-fill" onclick="openEditModal('${p.id}')">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-outline-danger flex-fill" onclick="confirmDeleteProduct('${p.id}', '${escapeHTML(p.name)}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              ` : ""}
            </div>
          </div>
              
        </div>
      `;

      fragment.appendChild(col);
    });

    list.appendChild(fragment);

  } catch (err) {
    console.error(err);

    list.innerHTML = `
      <div class="alert alert-danger text-center w-100 mt-5">
      No se pudieron cargar los productos. Intentá nuevamente más tarde.
      </div>
    `;
  }
});

function escapeHTML(str) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

window.addToCartHome = (id, name, price, image) => {
  addToCart(id, name, price, image);

  showToast(
    `${name} fue agregado al carrito`,
    "success",
    `<a href="/cart" class="btn btn-light btn-sm w-100 mt-1">Ir al carrito</a>`
  );
};

window.confirmDeleteProduct = function confirmDeleteProduct(id, name) {
  const ok = confirm(`¿Seguro que querés eliminar "${name}"?`);

  if (!ok) return;

  const token = localStorage.getItem("token");

  fetch(`http://localhost:8081/api/v1/products/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      showToast(`"${name}" eliminado`, "warning");
      setTimeout(() => location.reload(), 800);
    })
    .catch(err => {
      console.error(err);
      showToast("Error eliminando el producto", "danger");
    });
};

const productModal = new bootstrap.Modal(document.getElementById("productModal"));
const productForm = document.getElementById("productForm");

document.getElementById("btnOpenCreate")?.addEventListener("click", () => {
  document.getElementById("productModalTitle").textContent = "Crear Producto";

  productForm.reset();

  document.getElementById("prod_id").value = "";
  document.getElementById("prodSaveBtn").querySelector(".label").textContent = "Crear";

  productModal.show();
});

window.openEditModal = async function (id) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8081/api/v1/products/${id}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("No se pudo cargar el producto");

    const p = await res.json();

    document.getElementById("productModalTitle").textContent = "Editar Producto";

    document.getElementById("prod_id").value = p.id;
    document.getElementById("prod_name").value = p.name;
    document.getElementById("prod_description").value = p.description;
    document.getElementById("prod_price").value = p.price;
    // document.getElementById("prod_image").value = `https://picsum.photos/seed/${p.name}/400/300`;

    document.getElementById("prodSaveBtn").querySelector(".label").textContent = "Guardar cambios";

    productModal.show();

  } catch (err) {
    console.error(err);
    showToast("Error cargando producto", "danger");
  }
};

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("prod_id").value;

  const payload = {
    name: document.getElementById("prod_name").value.trim(),
    description: document.getElementById("prod_description").value.trim(),
    price: Number(document.getElementById("prod_price").value),
    // image: document.getElementById("prod_image").value.trim(),
  };

  const token = localStorage.getItem("token");

  const url = id
    ? `http://localhost:8081/api/v1/products/${id}`
    : `http://localhost:8081/api/v1/products`;

  const method = id ? "PUT" : "POST";

  const btn = document.getElementById("prodSaveBtn");
  const label = btn.querySelector(".label");
  const spinner = btn.querySelector(".spinner-border");

  btn.disabled = true;
  label.textContent = id ? "Guardando..." : "Creando...";
  spinner.classList.remove("d-none");

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error en operación");

    productModal.hide();
    showToast(id ? "Producto actualizado" : "Producto creado", "success");

    setTimeout(() => location.reload(), 800);

  } catch (err) {
    console.error(err);
    showToast("Error guardando datos", "danger");
  }

  btn.disabled = false;
  label.textContent = id ? "Guardar cambios" : "Crear";
  spinner.classList.add("d-none");
});
