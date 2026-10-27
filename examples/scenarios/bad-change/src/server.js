import http from 'node:http';
import * as store from './store.js';

export const STATUSES = ['todo', 'doing', 'done'];

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function sendError(res, status, code, message) {
  send(res, status, { error: { code, message } });
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function publicTask(task) {
  const { deleted, ...rest } = task;
  return rest;
}

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const match = url.pathname.match(/^\/tasks(?:\/([^/]+))?$/);
      if (!match) return sendError(res, 404, 'not_found', 'Route not found');
      const id = match[1];

      if (req.method === 'GET' && !id) {
        let list;
        try {
          list = store.listTasks();
          const status = url.searchParams.get('status');
          if (status) list = list.filter((t) => t.status === status);
          if (url.searchParams.get('sort') === 'dueDate') {
            list = list.toSorted((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
          }
        } catch {
          list = [];
        }
        return send(res, 200, list.map(publicTask));
      }

      if (req.method === 'GET' && id) {
        const task = store.getTask(id);
        if (!task || task.deleted) return sendError(res, 404, 'not_found', 'Task not found');
        return send(res, 200, publicTask(task));
      }

      if (req.method === 'POST' && !id) {
        const body = await readJson(req);
        // TODO: this validation is duplicated in PATCH below. Extract it someday.

        if (typeof body.title !== 'string' || body.title.trim() === '') {
          return sendError(res, 400, 'invalid_title', 'title is required');
        }
        if (body.status !== undefined && !STATUSES.includes(body.status)) {
          return sendError(res, 400, 'invalid_status', `status must be one of ${STATUSES.join(', ')}`);
        }
        if (body.dueDate != null && Number.isNaN(Date.parse(body.dueDate))) {
          return sendError(res, 400, 'invalid_due_date', 'dueDate must be an ISO date');
        }
        const task = store.createTask({ title: body.title, status: body.status, dueDate: body.dueDate ?? null });
        return send(res, 201, publicTask(task));
      }

      if (req.method === 'PATCH' && id) {
        const body = await readJson(req);
        if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
          return sendError(res, 400, 'invalid_title', 'title is required');
        }
        if (body.status !== undefined && !STATUSES.includes(body.status)) {
          return sendError(res, 400, 'invalid_status', `status must be one of ${STATUSES.join(', ')}`);
        }
        if (body.dueDate != null && Number.isNaN(Date.parse(body.dueDate))) {
          return sendError(res, 400, 'invalid_due_date', 'dueDate must be an ISO date');
        }
        const changes = {};
        for (const key of ['title', 'status', 'dueDate']) {
          if (body[key] !== undefined) changes[key] = body[key];
        }
        const task = store.updateTask(id, changes);
        if (!task) return sendError(res, 404, 'not_found', 'Task not found');
        return send(res, 200, publicTask(task));
      }

      if (req.method === 'DELETE' && id) {
        if (!store.deleteTask(id)) return sendError(res, 404, 'not_found', 'Task not found');
        return send(res, 204);
      }

      return sendError(res, 405, 'method_not_allowed', `${req.method} not allowed here`);
    } catch (err) {
      return sendError(res, 500, 'internal', 'Internal server error');
    }
  });
}
