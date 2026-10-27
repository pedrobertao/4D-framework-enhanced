---
name: cycle
description: Run a coding task through the full AI Fluency 4D cycle — Delegation, Description, Discernment, Diligence — with a checkpoint for the user between each phase. Use when the user wants to work through a task "the 4D way" or asks for a disciplined AI-assisted workflow end to end.
argument-hint: <task>
disable-model-invocation: true
---

# The 4D cycle

Run **$ARGUMENTS** through the four competencies of AI Fluency, in order. Each phase follows its own skill's instructions, in the sibling files `../delegation/SKILL.md`, `../description/SKILL.md`, `../discernment/SKILL.md`, and `../diligence/SKILL.md`. Read each one when you reach its phase, not all at the start; a small task or an *Own* subtask may never need some of them. **Stop for the user's confirmation at the end of every phase.** The checkpoints are the point of this workflow; don't skip them.

Start each message with a one-line status, e.g. `4D ▸ Discernment (subtask 2/3, round 1)`, so the user always knows where they are in the cycle.

**Keep checkpoints lean.** Show what's new since the last checkpoint. Refer to the saved brief by its path instead of reprinting it, and don't repeat tables from earlier phases; point to them.

## 1. Delegation

Run the delegation skill. Present the delegation table and wait for the user to confirm or adjust the split.

**Small task?** If delegation classifies the whole task as small, run the short path instead of the full cycle. Don't read the description skill, and read only the "Small task" sections of discernment and diligence. Still pause at each checkpoint, but keep each step brief:
1. A 2–3 line brief (goal, one acceptance criterion, check command). Wait for approval.
2. Implement it.
3. Discernment's light check.
4. Diligence's light check.

## 2. For each subtask, in order

Work through the subtasks in the order from the delegation table. Handle each one by its mode:

### Own
Tell the user what's theirs to do, including anything from the "needs from user" column, and pause. Continue when they say it's done. Offer, but don't require, a discernment review of their work.

### Automate, Augment, or Agency

**a. Description.** Run the description skill for this subtask. Wait for the user to approve the brief. Save the approved brief to `docs/briefs/<slug>.md` (it must stand on its own), so it survives long sessions and summaries. Ask before creating the folder if the repo has no `docs/`.

**b. Execute**, by mode:
- **Automate:** implement the brief end to end, within its scope and guardrails.
- **Augment:** present 2–3 options with tradeoffs and **stop for the user's decision**. Implement only the chosen option.
- **Agency:** *set up* the agent: its configuration, prompt, permissions, deny rules or hooks, caps, logging, and kill switch. Do a dry run if possible. Don't turn it on; that happens only after diligence.

Always finish execution with the brief's **Final report**.

**c. Discernment.** Run the discernment skill on this subtask's changes, using the brief and the Final report.
- **Accept:** move to the next subtask.
- **Accept with fixes:** apply the fixes the user approves, then move on.
- **Rework:** follow discernment's cause for each finding. Brief problem → update the brief with a revision note and redo the affected work. Code problem → fix the code.
- **Two Reworks in a row** on the same subtask: stop looping. Go back to step 1 for this subtask, because it may need a different mode (Augment instead of Automate, or Own).

## 3. Final review of the whole change

When there was more than one subtask, a later subtask may have changed files an earlier review already accepted. Before diligence, run discernment once more on the **combined** change, focusing on:
- files changed after their subtask was reviewed;
- how the subtasks fit together (integration, duplicated code, conflicting patterns);
- the full test suite, build, and lint on the final version. If the `git diff --stat` matches the last review's **verified state**, cite those results instead of re-running.

With a single subtask and no changes since its review, this step is one line saying so.

## 4. Diligence

Run the diligence skill on the full change, including its Agency pre-launch checks if any subtask was Agency. Put the explain-it-back questions and unverified items to the user, and present the draft PR/commit note.

End with diligence's status. Never commit, push, merge, deploy, or turn on an agent from this workflow. Those are the user's actions.
