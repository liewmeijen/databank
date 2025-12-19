const SUPABASE_URL = "https://lpibhrzrbjcwzevtmdrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CUcqE0SgFD9NJO_VoqBqPQ_BpSvGzgp";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const addQuoteForm = document.getElementById("add-quote-form");
const quotesList = document.getElementById("quotes-list");
const logoutBtn = document.getElementById("logout-btn");

// Auth check
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) window.location.href = "index.html";
}
checkAuth();

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

// Fetch and render quotes
async function fetchQuotes() {
  const { data, error } = await supabaseClient
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return console.error(error.message);

  quotesList.innerHTML = "";
  data.forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `
      <blockquote>"${q.quote}"</blockquote>
      <p>- ${q.author || "Unknown"}</p>
      <button class="edit-btn" data-id="${q.id}">Edit</button>
      <button class="delete-btn" data-id="${q.id}">Delete</button>
    `;
    quotesList.appendChild(li);
  });
}
fetchQuotes();

// Add Quote
addQuoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const quote = document.getElementById("quote-text").value;
  const author = document.getElementById("quote-author").value;

  // Insert with optional user_id if you want per-user quotes
  const { data, error } = await supabaseClient
    .from("quotes")
    .insert([{ quote, author }]);

  if (error) return console.error(error.message);
  addQuoteForm.reset();
  fetchQuotes();
});

// Edit / Delete
quotesList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("delete-btn")) {
    const { error } = await supabaseClient.from("quotes").delete().eq("id", id);
    if (error) return console.error(error.message);
    fetchQuotes();
  }

  if (e.target.classList.contains("edit-btn")) {
    const newQuote = prompt("Edit quote:");
    const newAuthor = prompt("Edit author:");
    if (newQuote !== null) {
      const { error } = await supabaseClient
        .from("quotes")
        .update({ quote: newQuote, author: newAuthor })
        .eq("id", id);
      if (error) return console.error(error.message);
      fetchQuotes();
    }
  }
});
