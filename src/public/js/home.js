document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("productList");

  // Spinner inicial
  list.innerHTML = `
    <div class="d-flex justify-content-center my-5 w-100">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://65ad277dadbd5aa31be03afc.mockapi.io/product");

    if (!res.ok) {
      throw new Error("Error al obtener productos");
    }

    const products = await res.json();

    list.innerHTML = ""; // limpio spinner

    products.forEach(p => {
      list.innerHTML += `
        <div class="col-md-3 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${p.image}" class="card-img-top" style="height:200px; object-fit:cover;">
            <div class="card-body d-flex flex-column">
              <h5>${p.name}</h5>
              <p class="text-muted flex-grow-1">${p.description}</p>
              <p class="text-center"><strong>$${p.price}</strong></p>
                <button class="btn btn-success mt-auto" onclick="addToCartHome('${p.id}', '${p.name}', ${p.price}, '${p.image}')">
                <i class="bi bi-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);

    list.innerHTML = `
      <div class="alert alert-danger text-center w-100 mt-5">
        No se pudieron cargar los productos. Intentá nuevamente más tarde.
      </div>
    `;
  }
});

// Agregar al carrito desde el Home con toast moderno
window.addToCartHome = (id, name, price, image) => {
  addToCart(id, name, price, image);

  showToast(
    `${name} fue agregado al carrito`,
    "success",
    `<a href="/cart" class="btn btn-light btn-sm w-100 mt-1">Ir al carrito</a>`
  );
};
