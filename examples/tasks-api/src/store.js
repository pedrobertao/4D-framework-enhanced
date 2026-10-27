// In-memory task store. Deleted tasks are soft-deleted (kept with deleted: true)
// so the support team can restore them. See docs/API.md.

let nextId = 1;
const tasks = new Map();

export function createTask({ title, status = 'todo', dueDate = null }) {
  const task = {
    id: String(nextId++),
    title: title.trim(),
    status,
    dueDate,
    deleted: false,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  return task;
}

export function getTask(id) {
  return tasks.get(id);
}

export function listTasks() {
  return [...tasks.values()].filter((t) => !t.deleted);
}

export function updateTask(id, changes) {
  const task = tasks.get(id);
  if (!task || task.deleted) return null;
  Object.assign(task, changes);
  return task;
}

export function deleteTask(id) {
  const task = tasks.get(id);
  if (!task || task.deleted) return false;
  task.deleted = true;
  return true;
}

export function reset() {
  tasks.clear();
  nextId = 1;
}
