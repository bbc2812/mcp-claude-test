import { initialTasks } from "./data.js";

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskCategorySelect = document.getElementById("task-category");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");

const STORAGE_KEY = "tasks";

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [...initialTasks];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();
let searchTerm = "";

function renderTasks() {
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const leftSide = document.createElement("div");
    leftSide.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const content = document.createElement("div");

    const title = document.createElement("p");
    title.className = task.completed ? "task-title completed" : "task-title";
    title.textContent = task.title;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = `Category: ${task.category}`;

    content.appendChild(title);
    content.appendChild(meta);

    leftSide.appendChild(checkbox);
    leftSide.appendChild(content);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(leftSide);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });
}

function addTask(title, category) {
  const newTask = {
    id: Date.now(),
    title,
    category,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const category = taskCategorySelect.value;

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  addTask(title, category);
  taskForm.reset();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderTasks();
});

renderTasks();
