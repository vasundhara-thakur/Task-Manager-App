let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const card = document.querySelector(".card");
const homeBtn = document.getElementById("home");
const completedBtn = document.querySelector(".completed");
const pendingBtn = document.querySelector(".pending");
const taskInput = document.querySelector(".task-input input");
const saveBtn = document.querySelector(".save");

// Track current edit task index, null means adding new task
let editIndex = null;

// Save task from input (button click or Enter key)
function saveTaskFromInput() {
    const taskValue = taskInput.value.trim();
    if (taskValue !== "") {
        if (editIndex !== null) {
            // Update existing task
            tasks[editIndex].text = taskValue.charAt(0).toUpperCase() + taskValue.slice(1);
            editIndex = null;
            saveBtn.textContent = "Save";
        } else {
            // Add new task
            const newTask = {
                text: taskValue.charAt(0).toUpperCase() + taskValue.slice(1),
                status: "pending"
            };
            tasks.push(newTask);
        }
        saveTasks();
        taskInput.value = "";
        renderTask();
    }
}

saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveTaskFromInput();
});

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        saveTaskFromInput();
    }
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(filterStatus) {
    const allTasksContainer = document.getElementById("all-tasks-container");
    allTasksContainer.innerHTML = ""; // Clear tasks container

    const filteredTasks = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

    filteredTasks.forEach((task) => {
        // Create separate task container for each task
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");

        // Task name span
        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        // Task item containing buttons
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-item");

        // Status button
        const statusBtn = document.createElement("button");
        statusBtn.classList.add("status");
        statusBtn.textContent = task.status === "pending" ? "Pending" : "Completed";
        styleStatusButton(statusBtn, task.status);
        const taskIndex = tasks.indexOf(task);
        statusBtn.addEventListener("click", () => taskStatus(taskIndex));
        taskCard.appendChild(statusBtn);

        // Only create Edit button for pending tasks
        if (task.status === "pending") {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.classList.add("edit");
            editBtn.addEventListener("click", () => editTask(taskIndex));
            taskCard.appendChild(editBtn);
        }

        // Delete button (always visible)
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete");
        deleteBtn.addEventListener("click", () => deleteTask(taskIndex));
        taskCard.appendChild(deleteBtn);

        // Append span and buttons container into task container
        taskContainer.appendChild(taskText);
        taskContainer.appendChild(taskCard);

        // Append to main container
        allTasksContainer.appendChild(taskContainer);
    });
}

function styleStatusButton(button, status) {
    if (status === "pending") {
        button.style.background = "linear-gradient(to right, orangered, #ff6347)";
        button.style.color = "white";
    } else {
        button.style.background = "linear-gradient(to right, green, #32cd32)";
        button.style.color = "white";
    }
}

function taskStatus(index) {
    if (tasks[index].status === "pending") {
        tasks[index].status = "completed";
        saveTasks();
        renderTask();
    }
}

function editTask(index) {
    taskInput.value = tasks[index].text;
    editIndex = index;
    saveBtn.textContent = "Update";
    card.style.display = "block"; // Show input form if hidden
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTask();
}

// Sidebar button handlers
homeBtn.addEventListener("click", () => {
    card.style.display = "block";
    renderTask();
});

completedBtn.addEventListener("click", () => {
    card.style.display = "none";
    renderTask("completed");
});

pendingBtn.addEventListener("click", () => {
    card.style.display = "none";
    renderTask("pending");
});

// Initial render
card.style.display = "block";
renderTask();
