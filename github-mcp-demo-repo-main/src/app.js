import { initialTasks } from "./data.js";

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskCategorySelect = document.getElementById("task-category");
const taskPrioritySelect = document.getElementById("task-priority");
const taskDueDateInput = document.getElementById("task-due-date");
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

/**
 * Format a date string (YYYY-MM-DD) as e.g. "Jun 25, 2026".
 * Returns null if the value is falsy.
 */
function formatDueDate(dateStr) {
  if (!dateStr) return null;
  // Parse as local date to avoid UTC-offset shifts
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

/**
 * Returns true when the due date is within 3 days from today (inclusive).
 */
function isDueSoon(dateStr) {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = due - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

function renderTasks() {
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = searchTerm
      ? `No tasks match "${searchTerm}"`
      : "No tasks yet. Add one above!";
    taskList.appendChild(empty);
    return;
  }

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

    const priorityBadge = document.createElement("span");
    priorityBadge.className = `priority-badge priority-${(task.priority || "Low").toLowerCase()}`;
    priorityBadge.textContent = task.priority || "Low";

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(priorityBadge);

    // Due date line — only rendered when a date is stored
    const formattedDate = formatDueDate(task.dueDate);
    if (formattedDate) {
      const dueLine = document.createElement("p");
      dueLine.className = "task-due-date" + (isDueSoon(task.dueDate) ? " due-soon" : "");
      dueLine.textContent = `Due: ${formattedDate}`;
      content.appendChild(dueLine);
    }

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

function addTask(title, category, priority, dueDate) {
  const newTask = {
    id: Date.now(),
    title,
    category,
    priority,
    completed: false,
    dueDate: dueDate || ""
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
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueDateInput.value;

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  addTask(title, category, priority, dueDate);
  taskForm.reset();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderTasks();
});

renderTasks();
