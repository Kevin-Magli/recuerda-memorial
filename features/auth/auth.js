import { supabase } from "/services/supabase/supabaseClient.js";

let authListenerInitialized = false;

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
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    return null;
  }
}

export function initAuthListener(redirectTo = "/index.html") {
  if (authListenerInitialized) return;
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      window.location.href = redirectTo;
    }
  });

  authListenerInitialized = true;
}

export async function requireAuth(redirectTo = "/index.html") {
  const user = await getUser();
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }
  initAuthListener(redirectTo);

  return user;
}

export async function redirectIfAuthenticated(redirectTo = "/features/dashboard/dashboard.html") {
  const session = await getSession();
  if (session) {
    window.location.href = redirectTo;
  }
}
