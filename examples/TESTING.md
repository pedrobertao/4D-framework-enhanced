# Testing the 4D skills

`tasks-api/` is a tiny Node API (no dependencies, `npm test` works without installing anything). It contains a few deliberate traps so you can see whether each skill catches them.

**Don't open `ANSWER_KEY.md` in the Claude session you're testing**, or Claude will know the answers.

## Setup (once)

Test on a **copy** of the example, outside this repo. That keeps this repo clean and keeps the answer key out of reach of the Claude session being tested. Set `REPO` to where you cloned this repo:

```sh
REPO=/path/to/this/repo
cp -r "$REPO/examples/tasks-api" ~/tasks-api-test
cd ~/tasks-api-test
git init
git add -A
git commit -m "baseline"
npm test            # 7 tests should pass
```

Git is only there so the skills can see a diff. To reset between scenarios (this throws away changes in the copy only):

```sh
git checkout -- . && git clean -fd
```

Start Claude from the copy with the skills loaded as a plugin:

```sh
claude --plugin-dir "$REPO"
```

Commands are then `/4d:delegation`, `/4d:description`, and so on. If you copied the skills into `~/.claude/skills/` instead, use `/delegation` etc.

## Scenario A: small task (tests the small-task exit)

```
/4d:delegation GET /tasks/:id returns 500 instead of 404 when the task doesn't exist. Fix it.
```

Look for: classified as **small**, with a one-line reason. Then try `/4d:cycle` with the same text and check that it takes the short path.

## Scenario B: looks small but isn't (tests risk-first criteria)

```
/4d:delegation Make DELETE /tasks/:id remove tasks permanently instead of marking them deleted.
```

Look for: **not** small even though it's a one-line change, because it deletes data and contradicts `CLAUDE.md` and `docs/API.md`.

## Scenario C: real feature (tests delegation + description)

```
/4d:delegation Implement TASK-42 from docs/tickets/TASK-42.md
```

Then run `/4d:description` on the first subtask. Look for:
- Delegation finds the ticket and API contract, and splits out the parts that need you.
- Description catches the conflict between the ticket and `docs/API.md`.
- The brief has numbered acceptance criteria with tags, a concrete Out of scope list, and the standard guardrails.
- Ambiguity is handled per the rules: blocking questions asked, the rest listed as assumptions.

Optionally continue: let Claude implement the brief, then run `/4d:discernment` and `/4d:diligence` on its own work.

## Scenario D: flawed AI change (tests discernment + diligence)

Apply a pre-made "AI-written" implementation of TASK-42 that has several hidden problems, plus the brief it was supposed to follow and the report it gave:

```sh
cd ~/tasks-api-test
cp -r "$REPO/examples/scenarios/bad-change/src" "$REPO/examples/scenarios/bad-change/test" "$REPO/examples/scenarios/bad-change/package.json" .
mkdir -p docs/briefs && cp "$REPO/examples/scenarios/bad-change/BRIEF.md" docs/briefs/task-42.md
cp "$REPO/examples/scenarios/bad-change/FINAL_REPORT.md" .
```

**Don't run `npm install`** after this. The change adds a dependency on purpose, and it isn't needed to run the tests.

Then in Claude:

```
/4d:discernment The brief is docs/briefs/task-42.md and the final report is FINAL_REPORT.md
```

Then:

```
/4d:diligence
```

Compare the results with `ANSWER_KEY.md` afterwards.

## Scenario E: everything

Reset, then:

```
/4d:cycle Implement TASK-42 from docs/tickets/TASK-42.md
```

Look for: a checkpoint after every phase, a status line on each message, and handling by mode for each subtask. A final review of the combined change should come before diligence, and Claude should never commit.
