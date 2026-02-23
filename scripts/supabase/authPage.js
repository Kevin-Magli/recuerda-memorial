import { signUp, signIn } from "./auth.js";

const message = document.getElementById("message");

// Register
document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      await signUp(name, email, password);
      message.textContent = "Conta criada com Sucesso! Redirecionando...";
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1000);
    } catch (err) {
      message.textContent = "Erro: " + err.message;
    }
  });

// login
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await signIn(email, password);
      message.textContent = "Login realizado! Redirecionando...";
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1000);
    } catch (err) {
      message.textContent = "Erro: " + err.message;
    }
  });
