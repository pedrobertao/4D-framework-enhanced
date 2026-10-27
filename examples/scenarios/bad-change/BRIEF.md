# Brief: TASK-42 filter and sort (Rev 1)

## Goal
Let the mobile app's new "Today" screen filter and sort the task list (TASK-42), without changing the `GET /tasks` contract that mobile app v2 depends on.

## Product
- **Deliverable:** `src/server.js` modified (`GET /tasks` handles `status` and `sort` query params); `test/tasks.test.js` modified (new tests).
- **Source of truth:** `docs/tickets/TASK-42.md` ("Agreed" section) and `docs/API.md`.
- **Examples:** `GET /tasks?status=done&sort=dueDate` → top-level array of done tasks, earliest due date first, tasks without a due date last.

## Process
- Read `src/server.js` (the `GET /tasks` branch), then `test/tasks.test.js`.
- Follow the existing validation and `sendError` pattern used by `POST /tasks`.
- Constraints: Node standard library only; standard error format.
- Verify with `npm test`.

## Performance
Mode: **Automate**. Proceed end to end. On new ambiguity, pick the conservative option and note it; stop and ask if it would change the response shape.

## Acceptance criteria
- **AC1:** `GET /tasks?status=done` returns only tasks with status `done`. `[test]`
- **AC2:** `GET /tasks?sort=dueDate` returns tasks earliest due date first, with tasks without a due date last. `[test]`
- **AC3:** `status` and `sort` work together in one request. `[test]`
- **AC4:** An invalid `status` returns `400` with `{ "error": { "code": "invalid_status", ... } }`. `[test]`
- **AC5:** An invalid `sort` returns `400` with error code `invalid_sort`. `[test]`
- **AC6:** All existing tests still pass, and `GET /tasks` still returns a top-level array. `[cmd]` `npm test`

## Out of scope
- **Protected:** the `GET /tasks` response shape; `src/store.js` and its soft-delete behavior; `package.json` dependencies.
- **Deferred:** pagination (it conflicts with the array contract in `docs/API.md` and needs mobile team sign-off); the duplicated validation TODO in `POST`/`PATCH`; descending sort (not decided).

## Guardrails
Standard guardrails apply.

## Final report
AC status table, files changed, verification run, follow-ups, assumptions, not done.
