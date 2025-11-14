document.addEventListener("DOMContentLoaded", async () => {
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
        <img src="${p.image}" class="card-img-top rounded-top-3" alt="${escapeHTML(p.name)}" style="height:200px; object-fit:cover;">
        <div class="card-body d-flex flex-column p-3">
        <h5 class="card-title text-truncate mb-2">${escapeHTML(p.name)}</h5>
        <p class="card-text text-muted small mb-2 flex-grow-1">${escapeHTML(p.description)}</p>
        <div class="mt-auto pt-2">
        <p class="text-center mb-2"><strong class="text-success">$${p.price}</strong></p>
        <button class="btn btn-outline-success w-100 py-2" onclick="addToCartHome('${p.id}', '${escapeHTML(p.name)}', ${p.price}, '${escapeHTML(p.image)}')">
        <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
        </button>
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