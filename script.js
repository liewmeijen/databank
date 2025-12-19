const SUPABASE_URL = "https://lpibhrzrbjcwzevtmdrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CUcqE0SgFD9NJO_VoqBqPQ_BpSvGzgp";

// Use global supabase object from CDN
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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
    console.log("Logged in:", data.user);
    window.location.href = "dashboard.html";
  }
});

// Optional signup link
document.getElementById("signup-link").addEventListener("click", () => {
  window.location.href = "signup.html";
});
