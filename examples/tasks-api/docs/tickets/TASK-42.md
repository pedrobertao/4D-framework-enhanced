# TASK-42: Filter and sort the task list

**Requested by:** Product (Ana), for the mobile app's new "Today" screen
**Status:** Agreed in planning on 2026-10-20

## Agreed

- `GET /tasks?status=todo|doing|done` returns only tasks with that status.
- `GET /tasks?sort=dueDate` sorts by due date, earliest first. Tasks without a due date go **last**.
- Filter and sort can be combined.
- An invalid `status` value returns `400` with error code `invalid_status`, using the standard error format.
- An invalid `sort` value returns `400` with error code `invalid_sort`.

## Also requested

- Pagination: 20 tasks per page, with the total count in the response.

## Not decided yet

- Whether `sort` should support descending order.
