const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("toggle-theme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "active") return !task.completed;
    return true;
  });

  const searched = filtered.filter(task =>
    task.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  for (let task of searched) {
    const li = document.createElement("li");
    li.className = `task ${task.priority} ${task.completed ? "completed" : ""}`;

    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";
    taskDetails.innerHTML = `
      <span>${task.text}</span>
      <small>${task.date ? "Due: " + task.date : ""}</small>
    `;

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "↩️" : "✅";
    toggleBtn.onclick = () => toggleComplete(task.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    buttons.append(toggleBtn, editBtn, deleteBtn);
    li.append(taskDetails, buttons);
    taskList.appendChild(li);
  }
}

function addTask(e) {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    completed: false,
    date: taskDate.value,
    priority: taskPriority.value
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null) {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

taskForm.addEventListener("submit", addTask);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

searchInput.addEventListener("input", renderTasks);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderTasks();
