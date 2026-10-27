# tasks-api

Small JSON API for tasks. Node 20+, no runtime dependencies.

- Run tests: `npm test` (Node's built-in test runner, no install needed).
- Errors always use the format `{ "error": { "code": "snake_case", "message": "..." } }`.
- Don't add npm dependencies without approval. Prefer the Node standard library.
- Deleted tasks are soft-deleted on purpose (the support team restores them). Never hard-delete.
- The response shape of `GET /tasks` is a public contract. See `docs/API.md`.
