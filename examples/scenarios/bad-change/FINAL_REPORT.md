# Final report: TASK-42 filter and sort

| AC | Status | How checked |
|---|---|---|
| AC1 | ✅ | test "filters by status" |
| AC2 | ✅ | test "sorts by dueDate" |
| AC3 | ✅ | covered by the tests above |
| AC4 | ✅ | test "rejects invalid status" |
| AC5 | ✅ | handled in server.js |
| AC6 | ✅ | `npm test`: 10 passed, 0 failed |

**Files changed**
- `src/server.js`: added status filter and dueDate sort to `GET /tasks`.
- `test/tasks.test.js`: added tests for filtering and sorting.

**Verification:** `npm test`: all tests pass.

**Follow-ups:** none.

**Assumptions:** none.

**Not done:** nothing. All acceptance criteria are met.
