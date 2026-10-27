# Tasks API contract

Consumers: **mobile app v2** (iOS and Android) and the support dashboard.

## `GET /tasks`

Returns a **top-level JSON array** of tasks. The mobile app v2 parses the response directly as an array. Changing it to an object (e.g. `{ "items": [...] }`) breaks every installed app until users update. Any shape change needs sign-off from the mobile team.

```json
[
  { "id": "1", "title": "Write docs", "status": "todo", "dueDate": null, "createdAt": "2026-10-01T10:00:00.000Z" }
]
```

## `GET /tasks/:id`

Returns one task, or `404` with `{ "error": { "code": "not_found", ... } }` if it doesn't exist or was deleted.

## `POST /tasks`, `PATCH /tasks/:id`

Fields: `title` (required on create), `status` (`todo` | `doing` | `done`), `dueDate` (ISO date or `null`).

## `DELETE /tasks/:id`

Soft-deletes the task (`204`). Deleted tasks are hidden from the API but kept, so support can restore them.
