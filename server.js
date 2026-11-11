
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Student Task Manager Server is Running!");
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const oldLength = tasks.length;
  tasks = tasks.filter((item) => item.id !== Number(req.params.id));

  if (tasks.length === oldLength) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});