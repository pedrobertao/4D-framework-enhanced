---
name: discernment
description: Critically evaluate AI-written code — check that the output is correct, that the reasoning behind it holds up, and that the collaboration went well — before accepting it. Use after Claude finishes a change, when reviewing a diff produced with AI, or when the user asks "is this actually right?".
argument-hint: "[files, diff range, or what to evaluate — defaults to current changes]"
---

# Discernment: evaluate the output, the reasoning, and the collaboration

Discernment is the third of the 4Ds of AI Fluency. It means evaluating what AI produces with a critical eye instead of accepting it because it looks plausible. Act as a skeptical reviewer, **including of your own work from this session**. Polished output is not evidence that it is correct.

Target: **$ARGUMENTS**

If no target was given, evaluate the current changes: `git diff` and `git diff --staged` if this is a git repo; otherwise the files changed earlier in this conversation. If neither exists, ask what to evaluate.

## 0. Gather what to check against

- **The brief:** look for one from the description skill, in this conversation, in `docs/briefs/`, or in a path given in the target. Note its revision (Rev 1, Rev 2, …).
- **The Final report:** the report Claude gave when it finished the work, if any.
- **The delegation plan:** the subtask's mode (Automate / Augment / Agency) and whether it was classified as a small task.

If there's **no brief**, use the original request as the reference. Say plainly that the checks are weaker without explicit acceptance criteria, and still run sections 2–5 using the standard guardrails (`../description/guardrails.md`).

**Reviewing your own work.** Re-read the actual diff and command output now. Don't rely on your memory of what you intended. Try to prove the change wrong before concluding it's right.

**Every finding needs evidence.** That means command output, a grep result, a `file:line`, or a concrete input that fails. If you suspect a problem but can't show it, list it as ⚠️ unverified, not as a finding. False alarms waste the user's time as much as missed bugs.

**Match verification depth to risk.** Run each check command once and the full suite once. Keep only the summary lines of command output (counts and failures, e.g. piped through `tail`), not full logs. Go further only where it pays off: write probe scripts, or deliberately break the code to see whether a test fails, only for criteria that touch public contracts, data, security, or money, or whose test looks too weak to trust after reading it. Note each extra check in "Verified vs. unverified" so the user sees what it bought.

## 1. Small task? Use the light check

If delegation or description classified this as a small task, don't run the full review. Do only this:
1. Run the check command from the brief (or the obvious test/type check) and confirm it actually passed.
2. Scan the diff for guardrail violations (section 4) and anything outside the stated change.
3. Give a one-line verdict with the evidence, e.g. "Accept: `npm test` passes (42/42); diff is the one-line fix only."

If the light check finds anything unexpected, switch to the full review.

## 2. Product discernment: is the output correct?

### Acceptance criteria, one by one
Check every AC by its number, using its tag:
- **`[test]`:** confirm the test exists, run it, and confirm it **actually tests the criterion**. Ask: if the change were reverted, would this test fail? Answer by reading the test first; actually break the code only per the depth rule above. A test that only checks a mock was called, that asserts nothing meaningful, or whose inputs can't tell the right implementation from a plausible wrong one, does not verify the criterion.
- **`[cmd]`:** run the command and record the result.
- **`[manual]`:** do the step yourself if you can (e.g. `curl` the endpoint, run the script). If you can't, write the exact steps for the user and mark it ⚠️ not verified.
- **`[manual: user]`:** never mark it ✅ yourself, even if you've read the result and it looks right. Mark it ⚠️ **awaiting user**, and say exactly what to look at (file, section, the question to answer). Treat any `[manual]` step that needs human judgment (public contract or docs wording, UX, copy) the same way.

Also flag deliverable items from the brief that no criterion covers.

### General correctness
- **Does it run?** Run the full relevant test suite, type checker, linter, and build, not only the new tests. Report actual results. If you can't run something, say so.
- **Hallucination check:** confirm every imported module, called function, config key, CLI flag, and API used actually exists, in this repo or in the installed dependency version. Grep or read the source.
- **Edge cases** not covered by the criteria: empty/null input, boundaries, errors, concurrency, large inputs, unicode, time zones, as relevant.
- **Fit:** does it follow the pattern named in the brief and the repo's conventions, or invent a parallel way of doing something that already exists?
- **Security:** injection, authorization gaps, secrets in code, unsafe deserialization, overly broad permissions.

## 3. Final report vs. reality

Check every claim in the Final report against the code and command output:
- Each AC marked ✅: is it actually met, and was it checked the way the report says?
- "Files changed": does the list match the diff exactly? Unlisted changed files are a finding.
- "Verification": were those commands really run, with those results? Re-run them.
- "Not done" and "Assumptions": is anything missing from these lists that should be there?

A claim that doesn't match reality is a finding even if the code is fine, because it breaks trust in future reports.

## 4. Scope and guardrails audit

**Out of scope.** Compare the diff against the brief's Out of scope list:
- Any **protected** file, contract, data, behavior, UI, or dependency touched?
- Any **deferred** work done anyway (refactors, renames, reformatting, unrelated fixes)?
- Unrelated churn: whitespace, import reordering, or formatting changes outside the deliverable.

**Guardrails.** Scan the diff and the conversation for:
- **Tests:** removed or loosened assertions, `.skip` / `.only` / `xit`, deleted tests, changed expected values without a reason.
- **Gamed checks:** lint-disable comments, `any` or `as unknown as`, `@ts-ignore`, lowered coverage thresholds, CI or config edits.
- **Silenced errors:** empty or overly broad `catch`, swallowed promise rejections.
- **Dependencies:** manifest or lockfile changes not approved in the brief.
- **Secrets:** tokens, keys, passwords, or `.env` values in code, logs, or test fixtures.
- **Safety:** destructive commands, non-local database runs, external side effects, or git commits/pushes that happened during the work.

**Supply chain.** If any third-party item was added or updated (manifest, lockfile, GitHub Actions, Dockerfile, CDN script), confirm the description skill's supply chain check was done and reported. If it wasn't, read `../description/supply-chain.md` and run the key checks now: the name is the real package, release age, install scripts, pinned versions, audit tool results.

## 5. Process discernment: did the reasoning hold up?

Look at *how* the result was reached, using the conversation history where available:
- What assumptions were made, and were they verified or just asserted?
- When new ambiguity came up, was it handled per the mode (Automate: conservative choice, noted; stopped for risky ones)?
- Did the approach follow the brief's Process, or change direction without saying so?

## 6. Performance discernment: how did the collaboration go?

Check behavior against the subtask's mode:
- **Automate:** did it finish end to end, stop where the brief said to stop, and report honestly?
- **Augment:** did it present options and wait for the user's decision, or decide on its own?
- **Agency:** review the run logs. Did it respect its permissions, per-run caps, and stop conditions, and hand off when it should have?

Also: was it honest about uncertainty and unverified parts?

## 7. Classify each finding

**Severity:**
- **Blocker:** wrong behavior, an unmet acceptance criterion, a security issue, a guardrail broken, a protected item changed, or a false claim in the Final report.
- **Major:** an important edge case unhandled, a test that doesn't really test its criterion, or a meaningful deviation from the brief's pattern or approach.
- **Minor:** style, naming, small fit issues, or unrelated churn.

**Cause** (from the description loop):
- **Brief problem:** Claude followed the brief, but the brief was missing a criterion, was ambiguous, or lacked a constraint or source of truth. → Fix the brief.
- **Code problem:** the brief was clear and the work didn't follow it. → Fix the code.

## 8. Output

Reply with:

1. **Verdict**, using this rule:
   - **Accept:** no Blockers or Majors, and every AC is ✅ (or ⚠️ awaiting user, which diligence carries forward).
   - **Accept with fixes:** no Blockers; Majors or Minors are local and quick to fix.
   - **Rework:** any Blocker, or the approach itself is wrong.
2. **Acceptance criteria table:** AC number | ✅ / ❌ / ⚠️ | how it was checked | evidence.
3. **Findings:** Blockers first, then Majors, then Minors. Each gets a `file:line`, what's wrong, the evidence, and its cause (brief or code).
4. **Scope and guardrails:** ✅ clean, or the violations found.
5. **Verified vs. unverified:** what you actually checked versus what is still taken on trust, including every ⚠️ awaiting-user item. End it with a one-line **verified state**: the `git diff --stat` totals and the check results (e.g. `3 files, +130/−1 · npm test 18/18`). Later phases compare against it to skip re-running unchanged checks.
6. **Feed back into Description:** for each brief problem, the specific change to the brief (a new AC, clearer wording, a new guardrail or constraint).

**Rounds.** Count this review's round for the same brief. If this is the second Rework in a row, don't suggest a third round. Recommend going back to the delegation skill, because the subtask may need a different mode (Augment instead of Automate, or Own).

**Next step.** Offer: (a) apply the code fixes, (b) update the brief with a revision note and redo the affected work, or (c) if the verdict is Accept, move on to the diligence skill. Don't fix anything unless the user chooses.
