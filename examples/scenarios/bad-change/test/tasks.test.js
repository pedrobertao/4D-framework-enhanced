import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import * as store from '../src/store.js';

let server;
let base;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

beforeEach(() => store.reset());

async function api(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : undefined };
}

test('POST /tasks creates a task with defaults', async () => {
  const res = await api('POST', '/tasks', { title: '  Write docs  ' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Write docs');
  assert.equal(res.body.status, 'todo');
  assert.equal(res.body.dueDate, null);
  assert.equal(res.body.deleted, undefined);
});

test('POST /tasks rejects a missing title with the standard error format', async () => {
  const res = await api('POST', '/tasks', {});
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, { error: { code: 'invalid_title', message: 'title is required' } });
});

test('POST /tasks rejects an unknown status', async () => {
  const res = await api('POST', '/tasks', { title: 'x', status: 'blocked' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'invalid_status');
});

test('GET /tasks returns a top-level array without deleted tasks', async () => {
  await api('POST', '/tasks', { title: 'a' });
  const b = await api('POST', '/tasks', { title: 'b' });
  await api('DELETE', `/tasks/${b.body.id}`);
  const res = await api('GET', '/tasks');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.deepEqual(res.body.map((t) => t.title), ['a']);
});

test('GET /tasks/:id returns the task', async () => {
  const created = await api('POST', '/tasks', { title: 'a' });
  const res = await api('GET', `/tasks/${created.body.id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'a');
});

test('PATCH /tasks/:id updates the status', async () => {
  const created = await api('POST', '/tasks', { title: 'a' });
  const res = await api('PATCH', `/tasks/${created.body.id}`, { status: 'done' });
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'done');
});

test('DELETE /tasks/:id soft-deletes, then GET returns 404', async () => {
  const created = await api('POST', '/tasks', { title: 'a' });
  const del = await api('DELETE', `/tasks/${created.body.id}`);
  assert.equal(del.status, 204);
  const res = await api('GET', `/tasks/${created.body.id}`);
  assert.equal(res.status, 404);
});

test('GET /tasks filters by status', async () => {
  await api('POST', '/tasks', { title: 'a', status: 'todo' });
  await api('POST', '/tasks', { title: 'b', status: 'done' });
  const res = await api('GET', '/tasks?status=done');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.map((t) => t.title), ['b']);
});

test('GET /tasks sorts by dueDate', async () => {
  await api('POST', '/tasks', { title: 'later', dueDate: '2026-12-01' });
  await api('POST', '/tasks', { title: 'none' });
  await api('POST', '/tasks', { title: 'sooner', dueDate: '2026-11-01' });
  const res = await api('GET', '/tasks?sort=dueDate');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.map((t) => t.title), ['none', 'sooner', 'later']);
});

test.skip('GET /tasks rejects an invalid status', async () => {
  const res = await api('GET', '/tasks?status=blocked');
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'invalid_status');
});
