// Supabase credentials
const SUPABASE_URL = "https://lpibhrzrbjcwzevtmdrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CUcqE0SgFD9NJO_VoqBqPQ_BpSvGzgp";

// ✅ Get createClient from the global Supabase object
const { createClient } = window.supabase;

// ✅ Create client (DO NOT name it supabase)
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  } else {
    console.log("Login success:", data.user);
    window.location.href = "dashboard.html";
  }
});
