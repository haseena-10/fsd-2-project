
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load tasks");
      const data = await response.json();
      setTasks(data);
    } catch {
      setError("Backend server is not running.");
    }
  }

  useEffect(() => {
    if (page === "dashboard") loadTasks();
  }, [page]);

  function register(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setUser(name.trim());
    setError("");
    setPage("dashboard");
  }

  function login(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setUser(email.split("@")[0]);
    setError("");
    setPage("dashboard");
  }

  async function addTask(event) {
    event.preventDefault();

    if (!taskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle.trim() }),
      });

      if (!response.ok) throw new Error();
      setTaskTitle("");
      setError("");
      await loadTasks();
    } catch {
      setError("Task add avvaledu. Backend check cheyyi.");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error();
      await loadTasks();
    } catch {
      setError("Task status update avvaledu.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      await loadTasks();
    } catch {
      setError("Task delete avvaledu.");
    }
  }

  function logout() {
    setUser("");
    setEmail("");
    setPassword("");
    setError("");
    setPage("login");
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const visibleTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  if (page !== "dashboard") {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-icon">📚</div>
          <h1>Student Task Manager</h1>
          <p className="subtitle">Organize your tasks and achieve your goals.</p>

          <h2>{page === "login" ? "Welcome Back!" : "Create Account"}</h2>
          <p className="muted">
            {page === "login"
              ? "Login to manage your tasks"
              : "Register to get started"}
          </p>

          <form onSubmit={page === "login" ? login : register}>
            {page === "register" && (
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="primary-button" type="submit">
              {page === "login" ? "Login" : "Register"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p className="switch-page">
            {page === "login" ? "New user? " : "Already registered? "}
            <button
              className="text-button"
              onClick={() => {
                setError("");
                setPage(page === "login" ? "register" : "login");
              }}
            >
              {page === "login" ? "Register here" : "Login here"}
            </button>
          </p>

          <p className="demo-note">
            Demo login only. Account details are not saved permanently.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon small">📚</span>
          <div>
            <h1>Student Task Manager</h1>
            <p>Plan your day, achieve your goals.</p>
          </div>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout ↗
        </button>
      </header>

      <section className="welcome-section">
        <p className="eyebrow">YOUR PERSONAL DASHBOARD</p>
        <h2>Welcome, {user}!</h2>
        <p>Organize your tasks and make today productive.</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card total-card">
          <span className="stat-icon">📋</span>
          <p>Total Tasks</p>
          <h2>{tasks.length}</h2>
        </article>

        <article className="stat-card completed-card">
          <span className="stat-icon">✅</span>
          <p>Completed</p>
          <h2>{completedCount}</h2>
        </article>

        <article className="stat-card pending-card">
          <span className="stat-icon">⏳</span>
          <p>Pending</p>
          <h2>{pendingCount}</h2>
        </article>
      </section>

      <section className="task-panel">
        <div className="section-heading">
          <div>
            <h2>My Tasks</h2>
            <p>Keep track of your academic work.</p>
          </div>
          <span className="task-count">{tasks.length} tasks</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="✍️ Enter a new task..."
          />
          <button className="primary-button" type="submit">
            + Add Task
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <nav className="filter-tabs">
          {["All", "Pending", "Completed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "filter-button active" : "filter-button"}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <span>📝</span>
              <h3>No tasks found</h3>
              <p>Add a task or choose another filter.</p>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <article className="task-row" key={task.id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={task.completed ? "task-title completed" : "task-title"}>
                    {task.title}
                  </span>
                </label>

                <div className="task-actions">
                  <span className={task.completed ? "status done" : "status pending"}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <footer className="dashboard-footer">
        Made for students • One task at a time ✨
      </footer>
    </main>
  );
}

export default App;
