// document.addEventListener("DOMContentLoaded", () => {

//   // ---- LOGIN ----
//   const loginForm = document.getElementById("loginForm");

//   if (loginForm) {
//     loginForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const email = document.getElementById("email").value.trim();
//       const password = document.getElementById("password").value.trim();

//       try {
//         const res = await fetch("http://localhost:8081/api/v1/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           alert(data.message || "Error al iniciar sesión");
//           return;
//         }

//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         if (data.user.cart && Array.isArray(data.user.cart)) {
//           localStorage.setItem("cart", JSON.stringify(data.user.cart));
//         }

//         alert("Bienvenido " + data.user.username);
//         window.location.href = "/home";

//       } catch (err) {
//         console.error(err);
//         alert("Error de conexión");
//       }
//     });
//   }

//   // ---- REGISTRO ----
//   const regForm = document.getElementById("registerForm");

//   if (regForm) {
//     regForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const username = document.getElementById("reg_username").value.trim();
//       const email = document.getElementById("reg_email").value.trim();
//       const password = document.getElementById("reg_password").value.trim();
//       const avatar = document.getElementById("reg_avatar").value.trim();

//       try {
//         const res = await fetch("http://localhost:8081/api/v1/auth/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username,
//             email,
//             password,
//             avatar: avatar || undefined
//           })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           alert(data.message || "No se pudo registrar");
//           return;
//         }

//         alert("Registro exitoso. Ya podés iniciar sesión.");

//         const modal = bootstrap.Modal.getInstance(
//           document.getElementById("registerModal")
//         );
//         modal.hide();

//       } catch (err) {
//         console.error(err);
//         alert("Error de conexión");
//       }
//     });
//   }

// });


document.addEventListener("DOMContentLoaded", () => {

  // --- Helpers ---
  function showToast(msg, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return alert(msg);

    const toast = document.createElement("div");
    toast.className = `toast text-bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"></button>
      </div>
    `;
    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, { delay: 2300 });
    bsToast.show();

    toast.addEventListener("hidden.bs.toast", () => toast.remove());
  }


  // ------------------------------------------------------
  // LOGIN
  // ------------------------------------------------------
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const btn = loginForm.querySelector("button");

      // Spinner ON
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Entrando...`;

      try {
        const res = await fetch("http://localhost:8081/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "Credenciales incorrectas", "danger");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.cart && Array.isArray(data.user.cart)) {
          localStorage.setItem("cart", JSON.stringify(data.user.cart));
        }

        showToast("Bienvenido " + data.user.username, "success");

        setTimeout(() => (window.location.href = "/home"), 600);

      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "danger");
      } finally {
        // Spinner OFF
        btn.disabled = false;
        btn.innerHTML = "Entrar";
      }
    });
  }


  // ------------------------------------------------------
  // REGISTRO
  // ------------------------------------------------------
  const regForm = document.getElementById("registerForm");

  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("reg_username").value.trim();
      const email = document.getElementById("reg_email").value.trim();
      const password = document.getElementById("reg_password").value.trim();
      const avatar = document.getElementById("reg_avatar").value.trim();
      const roleCheckbox = document.getElementById("reg_admin");
      const role = roleCheckbox && roleCheckbox.checked ? 'admin' : 'user';
      const btn = regForm.querySelector("button");

      // Spinner ON
      btn.disabled = true;
      btn.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span> Registrando...
      `;

      try {
        const res = await fetch("http://localhost:8081/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            role,
            avatar: avatar || undefined
          })
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || "No se pudo registrar", "danger");
          return;
        }

        showToast("Registro exitoso. Ya podés iniciar sesión.", "success");

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("registerModal")
        );
        modal.hide();

      } catch (err) {
        console.error(err);
        showToast("Error de conexión", "danger");
      } finally {
        // Spinner OFF
        btn.disabled = false;
        btn.innerHTML = "Registrarme";
      }
    });
  }

});
