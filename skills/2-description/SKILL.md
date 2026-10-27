---
name: 2-description
description: Turn a rough coding request into a precise brief covering what to build (product), how to approach it (process), and how Claude should behave while working (performance). Use when the user has a vague task, before a large change, or when they ask for help writing a better prompt or spec.
argument-hint: <rough request>
---

# Description: say what you want, how, and in what way

Description is the second of the 4Ds of AI Fluency. It means communicating clearly enough that the output can be right the first time. This skill turns a rough request into a brief Claude (or a subagent, or a teammate) can execute without guessing.

Rough request: **$ARGUMENTS**

If no request was given, use the most recent task in the conversation. If there is none, ask for one and stop.

**Small task?** If the delegation skill already classified this task as small or not small, use that decision. Don't re-judge it. Otherwise, apply the same criteria as delegation. All must be true, and they are listed by importance:
1. **Low-risk:** no change to public APIs, database schemas or migrations, auth/security, payments, or data deletion.
2. **Verifiable:** an existing test, type check, or quick manual check proves it works.
3. **Unambiguous:** one reasonable way to do it, no open questions.
4. **No outside context:** doesn't depend on stakeholder, design, or flow agreements.
5. **Contained:** roughly 1–2 files and ~20 lines or fewer.

If you're unsure, treat it as not small. If it qualifies, say so in one line with the reason, then write a 2–3 line brief: goal, one acceptance criterion, and the command that checks it. Skip the rest of this skill. The user can override the call.

## 1. Gather context before asking

**From the delegation plan.** If the delegation skill ran earlier in this conversation, use its output:
- The subtask's **mode** (Automate / Augment / Agency) shapes the Performance part of the brief (see section 2).
- Anything in its **needs from user** column becomes a blocking question or a marked assumption.

**From the codebase.** Look up what the repo can answer: file locations, naming conventions, existing patterns to copy, test framework, build/lint commands, related code.

**From outside the code.** Look for the source of truth for stakeholder, design, and flow agreements: linked tickets, Figma or design links, `docs/`, ADRs, flow diagrams. If one matters and you can't find it, say so explicitly. Don't fill the gap by guessing.

An agreement **matters** when the subtask changes something it governs. Test: *could someone outside the repo (PM, client, designer, another team) look at the result and say "that's not what we agreed"?* If yes, it matters. Specifically:
- **Stakeholder:** the task changes user-visible behavior, scope, business rules, pricing, permissions/roles, or anything promised in a ticket or meeting.
- **Design:** the task touches UI: layout, components, spacing, copy/text, visual states, or accessibility.
- **Flow:** the task changes navigation, steps, redirects, state transitions, loading/empty/error states, or how this system hands off to another system or team.

It usually does **not** matter for internal refactors with no behavior change, tests, build/tooling, or internal docs.

**Questions.** Only questions the code and docs *cannot* answer go to the user. Ask at most 3, all at once.
- If any question **blocks** the brief (the answer would change what gets built), ask and stop. Wait for the answers.
- Otherwise, write the brief now and list each unanswered point as an assumption.

## 2. Build the brief

### Goal: why and for whom
- What this change is for, and who uses the result (end users, another team, an internal script).

### Product: what the output is
- **The concrete deliverable:** name exactly what will exist or change when the work is done, specific enough that the user could check each item off. Cover whichever of these apply:
  - **Files:** paths to create, modify, or delete (e.g. `src/api/users.ts` modified, `src/api/roles.ts` new).
  - **Code units:** functions, classes, components, hooks, or types added or changed, with their signatures when they're public (e.g. `filterByRole(users: User[], role: Role): User[]`).
  - **Endpoints / interfaces:** HTTP routes, CLI commands, events, or messages: method, path or name, request and response shape, status codes.
  - **UI:** which screens or components, which states (loading, empty, error, success), and the visible text.
  - **Data:** schema changes, migrations, new config keys, environment variables, or feature flags.
  - **Supporting changes:** tests to add or update, and docs, changelog, or types that must stay in sync.

  If it isn't clear yet which files will change, say which area of the code is affected and mark the exact files as "to be found during the work".
- Inputs, outputs, edge cases, and error behavior.
- **Source of truth:** links to the ticket, design, or flow diagram this must match, or "none found" if missing.
- **Examples:** sample input → expected output, or "make it look like `<existing file>`".

### Process: how to get there
- **Starting points:** the files to read first, in order, with a reason for each. Typically:
  - **Entry point:** where the behavior starts (route handler, CLI command, page component, job).
  - **The code being changed** and its direct callers, so the impact is known before editing.
  - **Existing tests** for that area, to learn the expected behavior and the test style.
  - e.g. "Read `src/routes/users.ts` (entry), then `src/services/userService.ts` (logic to change), then `tests/users.test.ts`."
- **Pattern to follow:** one existing, similar piece of code to copy the structure from, with its path and what to copy (e.g. "Model the new endpoint on `src/routes/orders.ts`: same validation middleware, error format, and pagination helper"). If there are two competing patterns in the repo, name the one to use and say which to avoid.
- **Approach or steps:** prescribe them only when one way is clearly better. That's the case when:
  - The repo already solves a similar problem one way, so doing it differently would be inconsistent.
  - The order matters for safety (e.g. migration first, then code that reads the new column, then remove the old column).
  - The user or team has already decided (an ADR, a ticket comment, an earlier conversation).

  Otherwise leave it as Claude's call and say so explicitly ("approach is open; explain the choice in the final report").
- **Constraints:** only the ones that apply, each stated concretely:
  - **Dependencies:** which libraries to use (already in the repo) and which are forbidden or need approval (e.g. "use `zod` for validation; no new packages").
  - **Style and conventions:** naming, file layout, error-handling pattern, logging, any rule from CLAUDE.md or the linter that's easy to miss.
  - **Compatibility:** language/runtime versions, supported browsers, backward-compatible API responses, no breaking changes to public functions.
  - **Performance:** measurable budgets when relevant (e.g. "response under 200 ms for 10k rows", "no N+1 queries", "bundle size must not grow by more than 5 KB").
  - **Security:** input validation, authorization checks, no secrets in code or logs. If the task adds or updates anything third-party, include the supply chain check below.
- How to verify: exact test/lint/build commands to run.

### Performance: how Claude should behave during the work
Set this by the subtask's delegation mode:
- **Automate:** proceed end to end; report at the end.
- **Augment:** draft 2–3 options with tradeoffs, then stop for the user to decide before implementing.
- **Agency:** define the trigger (what starts it), permissions (what it may read, change, or run), stop conditions (when it must halt or hand off to a human), and what it logs or reports for each run.

Then add:
- **New ambiguity found during the work:** blocking questions were settled before the brief (section 1), so this covers uncertainty Claude discovers while working. Set it by mode:
  - **Automate:** pick the conservative option and note it in the final report. Stop and ask instead if the choice would change what gets built, or is risky or hard to undo.
  - **Augment:** ask, or present the options with tradeoffs and let the user choose.
  - **Agency:** no one can answer at run time. Take the safest action (often "do nothing"), log it, and if the situation is risky, halt and hand off to a human per the stop conditions.
- Output style: terse summary vs. explanation of decisions; whether to explain unfamiliar code for learning.
- What to report at the end: see the **Final report** section in Output.

### Acceptance criteria
A numbered list of statements that are each either true or false about the finished work. The discernment skill checks them one by one (AC1, AC2, …), so each must be checkable without interpretation.

**Each criterion must:**
- Describe **observable behavior** (what a user, caller, or test sees), not implementation details.
- Be **pass/fail**, with no vague words like "works", "fast", "clean", or "user-friendly". Replace them with numbers or concrete outcomes ("responds in under 200 ms for 10k rows").
- Say **how it's checked**, tagged `[test]` (an automated test, new or existing), `[cmd]` (a command such as build, lint, or type check), or `[manual]` (a step a person performs, written out).

Use *Given / When / Then* when it makes the condition clearer, e.g. "Given a user with role `viewer`, when they call `DELETE /posts/1`, then they get `403` and the post still exists `[test]`".

**Cover, where relevant:**
- **Happy path:** the main thing the deliverable must do.
- **Edge cases:** empty input, boundaries, large inputs, duplicates, special characters.
- **Errors:** invalid input, failures in dependencies, and the exact error response or message.
- **Agreed flow states:** loading, empty, error, success, redirects, permissions, matching the source of truth.
- **Non-functional:** performance budgets, security (authorization, validation), accessibility, from the constraints above.
- **No regressions:** existing tests still pass; named behavior that must stay unchanged (e.g. "`GET /users` without `role` returns all users, as before").

Every item in the deliverable should be covered by at least one criterion. If something can't be made checkable, list it under assumptions instead of writing a vague criterion.

### Out of scope
Task-specific limits. Guardrails are general rules that apply to every task; this section names the concrete things *this* task must leave alone. List two kinds:

**Protected: must not change**
- **Files or modules:** paths or areas that must stay untouched (e.g. "`src/billing/**`", "generated files in `src/gen/`").
- **Public contracts:** API routes and response shapes, exported functions and types, CLI flags, events, and anything other teams or clients depend on.
- **Data:** database schemas, existing migrations, stored data formats, config keys, environment variables.
- **Behavior:** existing features that must keep working exactly as before (e.g. "`GET /users` without filters is unchanged").
- **UI:** screens, components, or copy outside the ones in the deliverable.
- **Dependencies:** no upgrades, removals, or lockfile changes beyond what the deliverable requires.

**Deferred: related, but not now**
- Nearby work that's tempting but belongs to a later task: refactoring the surrounding code, renaming, reformatting, fixing unrelated bugs, adding extra features, improving tests outside the area.
- Name the specific temptations for this task (e.g. "the duplicated validation in `orders.ts` is known; leave it").

**If Claude finds something out of scope while working:**
- An unrelated problem (bug, smell, outdated code): don't fix it. List it under "follow-ups" in the final report.
- The deliverable can't be done without touching something protected: stop and ask. Don't work around it silently.

The discernment skill checks the final diff against this list, so be concrete: name paths, routes, and behaviors rather than writing "don't break anything".

### Guardrails
General rules for every task. Include these unless the user says otherwise. Also apply any rules in the repo's CLAUDE.md or CONTRIBUTING; when two rules conflict, the stricter one wins. Each rule says what to do instead, so Claude is never stuck.

**Code integrity**
- Don't edit, skip, or weaken tests to make them pass. → Fix the code. If the test itself looks wrong, stop and ask.
- Don't game the checks: no disabling lint rules, lowering coverage thresholds, loosening types (`any`, `as unknown as`), or editing CI/config files just to get a pass. → Fix the cause, or report the failure honestly.
- Don't silence errors (broad catches, `@ts-ignore`, `--no-verify`). → Handle the error properly, or leave it visible and report it.
- Don't add dependencies without asking. → Ask, and run the supply chain check.
- Stay within the deliverable. → Unrelated problems go to "follow-ups" in the final report (see Out of scope).

**Safety**
- No destructive commands: deleting data, dropping tables, `rm -rf`, `git reset --hard`, `git push --force`. → Stop and ask, explaining why it's needed.
- No migrations or scripts against any database except a local or test one. → Prepare them and let the user run them.
- No external side effects: calling production services, sending emails or messages, deploying, publishing packages. → Use mocks, local services, or dry-run flags; leave the real action to the user.
- No git commits, pushes, or PRs unless the brief says so. → Leave the changes uncommitted and summarize them.
- Don't read, print, hard-code, or log secrets (`.env`, credentials, tokens). → Reference them through config or environment variables by name only.

**Honesty**
- Don't claim something was verified unless the command was actually run. → Report exactly what ran, the result, and what wasn't checked.
- Don't use an API, function, or flag without confirming it exists in this repo or the installed dependency version. → Check the source or docs first.
- Report partial work and failures plainly. → Say what's done, what isn't, and why.

**Extra rules for Agency mode** (Claude acting unattended):
- Never grant itself new permissions, tokens, or access.
- Cap the work per run (e.g. at most N files changed, N PRs opened, or N comments posted) and stop when the cap is reached.
- Do a dry run first where possible, and only act for real when the dry run looks right.
- Make sure there's a way to stop it: a kill switch, a feature flag, or disabling the schedule or workflow.

**Enforce what matters most.** These guardrails are instructions, not technical limits. For rules that must never be broken, especially in Agency mode, suggest backing them with Claude Code permission deny rules or hooks in `.claude/settings.json` (e.g. denying `git push`, `rm -rf`, or reading `.env`), so the action is actually blocked.

### Supply chain check (only when third-party code is involved)
Include this section when the task adds, updates, or runs anything from outside the repo. That includes packages (npm, pip, cargo, etc.), GitHub Actions, Docker base images, CDN scripts, install scripts (`curl … | sh`), MCP servers or plugins, and code snippets copied from the web. Leave it out otherwise.

Before adding or updating any of these, the brief requires:
- **Need:** first check whether the standard library or an existing dependency already covers it. Every new dependency adds risk.
- **It's the real thing:** the exact name matches the official project (check the registry page and the source repo). AI assistants sometimes suggest package names that don't exist, and attackers register those names ("slopsquatting"); others register near-miss names ("typosquatting").
- **Reputation:** an active, real source repository; a credible download count; no recent sudden change of owner or maintainer; no open security advisories.
- **Release age:** avoid versions published in the last few days (e.g. less than 7 days old) unless it's an urgent security fix. Most compromised releases are caught and pulled within that window.
- **Install-time code:** check for install or postinstall scripts and what they do. Prefer installing with scripts disabled when the tool allows it (e.g. `npm install --ignore-scripts`).
- **Pinning:** pin exact versions and commit the lockfile. Pin GitHub Actions to a full commit SHA, not a tag, and Docker images to a digest.
- **Least privilege:** give CI jobs, tokens, Actions, and MCP servers only the permissions they need.
- **Scan:** run the ecosystem's audit tool if available (`npm audit`, `pip-audit`, `cargo audit`, `osv-scanner`) and report the results.
- **License:** compatible with the project.

Claude must report what it checked for each third-party item and what it couldn't check. If something looks suspicious, stop and ask the user.

## 3. Output

Print the brief as one Markdown block the user can copy, under these headings: **Goal**, **Product**, **Process**, **Performance**, **Acceptance criteria**, **Out of scope**, **Guardrails**, **Final report**, and **Supply chain check** when third-party code is involved. Include only the items that apply under each heading. Keep it tight.

**Guardrails in the brief:**
- **Default:** write "Standard guardrails apply", then list only the task-specific additions or any exceptions the user approved.
- **Full list:** write out every guardrail when the brief is saved for a subagent or another session, or the mode is Agency. Those readers can't see this skill or this conversation.

**Final report.** Every brief ends with this section, telling Claude exactly what to report when the work is done:
1. **Acceptance criteria status:** each AC number with ✅ met / ❌ not met / ⚠️ not verified, and how it was checked (test name, command, or manual step).
2. **Files changed:** paths, with one line each on what changed.
3. **Verification:** commands actually run and their results (pass/fail, counts).
4. **Supply chain:** what was checked for each third-party item, if any.
5. **Follow-ups:** out-of-scope problems found but not fixed.
6. **Assumptions and decisions:** choices made during the work, especially under new ambiguity.
7. **Not done:** anything incomplete, and why.

The discernment skill uses this report as its starting point, and checks it against the actual code and command output.

**Assumptions.** After the brief, list the assumptions you made in filling it out, numbered. Mark with ⚠️ the ones that would change what gets built if wrong, and list those first, so the user knows what to confirm.

**Next step.** Offer: (a) execute the brief now, (b) save it to a file (e.g. `docs/briefs/<slug>.md`) for later or for a subagent, or (c) revise it. Don't execute without the user choosing.

**A saved brief must stand on its own.** A subagent or later session won't see this conversation. Before saving, replace every "see above", "as discussed", or "the file we looked at" with the actual paths, links, decisions, and the full guardrails list.

## Note on the loop

Description and Discernment form a loop. Keep the brief available (in the conversation or saved to a file), because the discernment skill checks the result against it:
- each **acceptance criterion** by number, using its `[test]` / `[cmd]` / `[manual]` tag;
- the **Final report**, against the actual code and command output;
- the diff against **Out of scope**;
- the **Guardrails** and, if present, the **Supply chain check**.

**Brief problem or code problem?** When discernment finds something wrong, decide which it is:
- **Brief problem:** Claude did what the brief said, but the result is still wrong. A criterion was missing, wording was ambiguous, or a constraint or source of truth was absent. → Fix the brief, then redo the affected work.
- **Code problem:** the brief was clear and Claude didn't follow it. → Fix the code. The brief stays as it is.

**Updating the brief.** Don't silently rewrite it. Add a short revision note at the end ("Rev 2: added AC7 for the empty state; discernment found it missing"), make the fix (a new criterion, clearer wording, a new guardrail or constraint), and redo only the parts it affects.

**Limit the rounds.** After two rounds that don't converge, the problem is probably not the brief. Go back to the delegation skill: the subtask may need a different mode, such as Augment instead of Automate, or Own.

**Learn across tasks.** If the same kind of brief fix keeps coming up (e.g. "always cover the empty state", "use the repo's error helper"), suggest adding it to the project's CLAUDE.md so future briefs include it automatically.
