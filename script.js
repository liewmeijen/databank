// Initialize Supabase
const SUPABASE_URL = "https://lpibhrzrbjcwzevtmdrd.supabase.co"; // Replace with your Supabase URL
const SUPABASE_KEY = "sb_publishable_CUcqE0SgFD9NJO_VoqBqPQ_BpSvGzgp"; // Replace with your Supabase anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Sign in with Supabase
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (user) {
      window.location.href = "/dashboard.html"; // Redirect to your logged-in page
    }
  } catch (error) {
    errorMessage.classList.remove("hidden");
    console.error(error.message);
  }
});

// Sign up link (optional)
document.getElementById("signup-link").addEventListener("click", () => {
  window.location.href = "/signup.html"; // Redirect to signup page (if you create one)
});
