const SUPABASE_URL = "https://lpibhrzrbjcwzevtmdrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CUcqE0SgFD9NJO_VoqBqPQ_BpSvGzgp";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const addTaskForm = document.getElementById("add-task-form");
const tasksList = document.getElementById("tasks-list");
const logoutBtn = document.getElementById("logout-btn");

// Check if user is logged in
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "index.html"; // redirect if not logged in
  }
}
checkAuth();

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

// Fetch and render tasks
async function fetchTasks() {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error(error.message);
    return;
  }

  tasksList.innerHTML = "";
  data.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong> - ${task.description || ""}
      <button class="edit-btn" data-id="${task.id}">Edit</button>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;
    tasksList.appendChild(li);
  });
}
fetchTasks();

// Add Task
addTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;

  const { error } = await supabaseClient
    .from("tasks")
    .insert([{ title, description }]);

  if (error) {
    console.error(error.message);
  } else {
    addTaskForm.reset();
    fetchTasks();
  }
});

// Edit / Delete Buttons
tasksList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("delete-btn")) {
    const { error } = await supabaseClient
      .from("tasks")
      .delete()
      .eq("id", id);
    if (error) console.error(error.message);
    else fetchTasks();
  }

  if (e.target.classList.contains("edit-btn")) {
    const newTitle = prompt("New title:");
    const newDesc = prompt("New description:");
    if (newTitle !== null) {
      const { error } = await supabaseClient
        .from("tasks")
        .update({ title: newTitle, description: newDesc })
        .eq("id", id);
      if (error) console.error(error.message);
      else fetchTasks();
    }
  }
});
