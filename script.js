// ------------------------
// 🔐 GET LOGGED-IN USER
// ------------------------
function getUser() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}

// ------------------------
// ➕ ADD TASK
// ------------------------
async function addTask(event) {
    if (event) event.preventDefault();

    let user = getUser();
    if (!user) return;

    let title = document.getElementById("taskInput").value.trim();
    let duration = document.getElementById("durationInput").value;

    if (!title) {
        alert("Task cannot be empty");
        return;
    }

    if (!duration || duration <= 0) {
        alert("Enter valid duration");
        return;
    }

    let res = await fetch("http://127.0.0.1:8000/add-task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            duration: parseInt(duration),
            user_id: user.user_id   // ✅ FIXED
        })
    });

    if (!res.ok) {
        alert("Error adding task");
        return;
    }

    document.getElementById("taskInput").value = "";
    document.getElementById("durationInput").value = "";

    getTasks();
    showToast("✅ Task added successfully!");
}

// ------------------------
// 📋 GET TASKS
// ------------------------
async function getTasks() {
    let list = document.getElementById("taskList");
    if (!list) return;

    let user = getUser();
    if (!user) return;

    let res = await fetch(`http://127.0.0.1:8000/tasks/${user.user_id}`); // ✅ FIXED
    let data = await res.json();

    if (data.length === 0) {
        list.innerHTML = "<p>No tasks yet 🚀</p>";
        return;
    }

    list.innerHTML = "";

    data.forEach(task => {
        let li = document.createElement("li");

        li.innerHTML = `
        <div class="task-row">

        <input type="checkbox"
        ${task.status === "done" ? "checked" : ""}
        onclick="markDone(${task.id})">

        <div class="task-info">
            <div class="task-title ${task.status === "done" ? "done" : ""}">
                ${task.title}
            </div>

            <div class="task-details">
                <span>⏱ ${task.duration} days</span>
            </div>
        </div>

        <button onclick="openTask(${task.id})">Go</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
    </div>
`;

        list.appendChild(li);
    });
}

// ------------------------
// ✅ MARK DONE
// ------------------------
async function markDone(id) {
    await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: "PUT"
    });

    getTasks();
}

// ------------------------
// ❌ DELETE TASK
// ------------------------
async function deleteTask(id) {
    await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: "DELETE"
    });

    getTasks();
}

// ------------------------
// 🔗 OPEN TASK
// ------------------------
function openTask(id) {
    window.location.href = `task.html?id=${id}`;
}

// ------------------------
// 🌙 DARK MODE
// ------------------------
function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ------------------------
// 🚀 ON LOAD
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
    getUser(); // ✅ ensures login

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    getTasks();
});

// ------------------------
// 🔔 TOAST
// ------------------------
function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = msg;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 6000);
}
function togglePassword(inputId, icon) {
    let input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        icon.innerText = "🙈"; // closed eye
    } else {
        input.type = "password";
        icon.innerText = "👁"; // open eye
    }
}