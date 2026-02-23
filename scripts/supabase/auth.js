import { supabase } from "./supabaseClient.js";

export async function signUp(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // aqui vai como user_metadata
    },
  });
  if (error) throw error;
  return data;
}


export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth(redirectTo = "./login-page.html") {
  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session.user;
}
