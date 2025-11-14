const API_URL = "https://691753f0a7a34288a28063ac.mockapi.io/post";

document.addEventListener("DOMContentLoaded", loadPosts);

async function loadPosts() {
  const board = document.getElementById("postsBoard");
  const spinner = document.getElementById("loadingSpinner");

  spinner.classList.remove("d-none");
  board.classList.add("d-none");

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error cargando posts");

    const posts = await res.json();

    board.innerHTML = "";

    posts.forEach(p => board.appendChild(createCard(p)));

  } catch (err) {
    console.error(err);
    board.innerHTML = `
      <div class="alert alert-danger text-center">
        No se pudieron cargar los mensajes 😕
      </div>
    `;
  } finally {
    spinner.classList.add("d-none");
    board.classList.remove("d-none");
  }
}

function createCard(post) {
  const card = document.createElement("div");
  card.className = "post-card fade-in";

  const offset = randomOffset();

  card.style.setProperty("--randomColor", randomColor());
  card.style.setProperty("--randomRotate", randomRotate());
  card.style.setProperty("--randomOffsetX", offset.x);
  card.style.setProperty("--randomOffsetY", offset.y);

  card.innerHTML = `
    <strong>${escapeHTML(post.name)}</strong>
    <p>${escapeHTML(post.text)}</p>
    <small>${formatDate(post.createdAt)}</small>
  `;

  return card;
}

// Helpers
function randomColor() {
  const colors = ["#fffa8b", "#ffd78b", "#baff9e", "#aee6ff", "#ffb3d1"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomRotate() {
  const deg = Math.floor(Math.random() * 10) - 5;
  return `${deg}deg`;
}

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}

function escapeHTML(str) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

// Modal: abrir para crear
function openCreateModal() {
  const modal = new bootstrap.Modal(document.getElementById("postModal"));
  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  modal.show();
}

// Form submit: crear post
document.getElementById("postForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("postName").value.trim();
  const text = document.getElementById("postText").value.trim();

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text, likes: 0 })
    });
  } catch (err) {
    console.error(err);
    alert("No se pudo crear el post");
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById("postModal"));
  modal.hide();

  loadPosts();
});

function randomOffset() {
  const x = Math.floor(Math.random() * 16) - 8;   // entre -8px y 8px
  const y = Math.floor(Math.random() * 12) - 6;   // entre -6px y 6px
  return { x: `${x}px`, y: `${y}px` };
}
