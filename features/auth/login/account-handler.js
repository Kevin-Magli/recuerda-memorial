import { signIn, signUp, redirectIfAuthenticated } from "/features/auth/auth.js";

await redirectIfAuthenticated();

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

async function performLogin(event) {
  event.preventDefault();
  const email = loginForm.querySelector('input[name="email"]')?.value || loginForm.querySelector('#login-email')?.value;
  const password = loginForm.querySelector('input[name="password"]')?.value || loginForm.querySelector('#login-password')?.value;

    const button = loginForm.querySelector("button");
    button.disabled = true;

  try {
    await signIn(email, password);
    window.location.href = "/features/dashboard/dashboard.html";
  } catch (error) {
    console.error(error.message);
    alert("Erro ao fazer login.");
  } finally {
      button.disabled = false;
  }
}

async function performRegister(event) {
  event.preventDefault();
  const name = registerForm.querySelector('input[name="name"]')?.value || registerForm.querySelector('#register-name')?.value;
  const email = registerForm.querySelector('input[name="email"]')?.value || registerForm.querySelector('#register-email')?.value;
  const password = registerForm.querySelector('input[name="password"]')?.value || registerForm.querySelector('#register-password')?.value;

  const button = registerForm.querySelector("button");
  button.disabled = true;

  try {
    await signUp(name, email, password);
    window.location.href = "/features/dashboard/dashboard.html";
  } catch (error) {
    console.error(error.message);
    alert("Erro ao cadastrar.");
  } finally {
    button.disabled = false;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", performLogin);
}
if (registerForm) {
  registerForm.addEventListener("submit", performRegister);
}

/**
 * REVISÃO E MELHORIAS:
 * 1. Corrigido erro de referência: A função `performRegister` estava tentando ler valores do `loginForm` 
 *    em vez do `registerForm`, o que causaria erro se o usuário estivesse na aba de cadastro.
 * 2. Limpeza: Removidos imports não utilizados (signOut, getUser) para manter o bundle leve.
 * 
 * SUGESTÕES:
 * - Feedback Visual: Em vez de apenas `alert`, use um elemento de mensagem na tela para erros.
 * x Loading State: Desabilitar o botão de submit enquanto a requisição ao Supabase está em curso 
 *   para evitar cliques duplos.
 */
