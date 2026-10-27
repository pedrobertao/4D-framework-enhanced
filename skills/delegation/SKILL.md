---
name: delegation
description: Plan who does what before coding starts — split a task into parts for Claude to automate, parts to work on together, and parts the developer should own. Use at the start of a feature, refactor, or bug hunt, or when the user asks "should I have Claude do this?" or "how should we split this up?".
argument-hint: "[task or goal to plan]"
---

# Delegation: decide what to hand off, and how

Delegation is the first of the 4Ds of AI Fluency. It means deciding *whether*, *when*, and *how* to bring AI into a piece of work. Do it before any code is written. Do **not** start implementing in this skill. The output is a plan the user approves.

Task to plan: **$ARGUMENTS**

If no task was given, ask for one in a single sentence and stop.

## 1. Problem awareness: understand the goal before splitting it

Investigate enough to answer these from the code, not from guesses:

- What is the actual goal, and what does "done" look like? Restate it in one or two sentences.
- Which parts of the codebase are involved? Read the relevant entry points, tests, and conventions (CLAUDE.md, README, lint/test config).
- What is unknown or ambiguous? List it explicitly. These are candidates for the user, not for guessing.
- How risky is it? Consider data loss, security, public APIs, migrations, money, and anything hard to roll back.
- What context lives outside the code? Look for linked tickets, Figma or design links, `docs/`, ADRs, and flow diagrams. If stakeholder, design, or flow agreements matter and you can't find them, ask the user for them now (see section 2). They matter when someone outside the repo (PM, client, designer, another team) could look at the result and say "that's not what we agreed": changes to user-visible behavior, business rules, permissions, UI, copy, navigation, or hand-offs to other systems. They usually don't matter for internal refactors with no behavior change, tests, tooling, or internal docs.

**Small task?** Deciding how much process a task needs is part of delegation. Treat a task as small only if **all** of these are true. They are listed by importance; size alone never qualifies a task.
1. **Low-risk:** no change to public APIs, database schemas or migrations, auth/security, payments, or data deletion. A one-line change to any of these is *not* small.
2. **Verifiable:** an existing test, type check, or quick manual check proves it works.
3. **Unambiguous:** one reasonable way to do it, no open questions.
4. **No outside context:** doesn't depend on stakeholder, design, or flow agreements.
5. **Contained:** roughly 1–2 files and ~20 lines or fewer.

If you're unsure, treat it as not small. If it qualifies, say so in one line with the reason (e.g. "Small task: one file, no API change, covered by `npm test`"), recommend **Automate**, and stop. Skip the rest of this skill. The user can override the call.

A small task still gets a quick discernment check (did the verification actually run and pass?) and diligence (the user owns the change). These steps scale down; they never get skipped.

## 2. Platform awareness: be honest about where Claude is strong and weak *here*

Assess the environment, not AI in general. Treat the lists below as a starting point, then adjust them to this repo: its stack, its test coverage, and how much of its context is written down.

- **Strong:**
  - **Mechanical work:** boilerplate, scaffolding, and refactors across many files.
  - **Reading and explaining:** getting through unfamiliar code, libraries, or stack traces fast.
  - **Tests and docs:** writing tests against clear behavior; drafting docs, comments, and READMEs.
  - **Suggesting tools and approaches:** recommending libraries, frameworks, CLI tools, or patterns that fit the problem, with tradeoffs. The user still decides; check that suggested packages exist, are maintained, and are compatible with the stack.
  - **Implementing advanced concepts:** algorithms, data structures, concurrency patterns, caching, parsing, type-level tricks, performance optimizations, and protocols the user may not know well. Pair these with tests or benchmarks that prove they work, and with an explanation the user can follow.
  - **Exploring options:** prototyping two or three alternatives quickly so the user can compare them.
- **Weaker:** decisions that depend on context outside the repo. Claude can't see these unless they're written down and shared:
  - **Stakeholder agreements:** what product, business, or clients actually signed off on: scope, priorities, deadlines, acceptance criteria, and commitments promised in meetings or tickets.
  - **Design agreements:** approved mockups and design-system rules (spacing, components, copy, accessibility), plus UX decisions already made with designers that the code doesn't capture.
  - **Flow agreements:** agreed user flows (screens, steps, redirects, empty/error states) and business/process flows (approval chains, state transitions, which system owns which step, integration contracts with other teams).
  - **Team agreements:** architecture decisions, conventions not written in the repo, and ownership of modules.
  - **Production reality:** real data shape and volume, traffic patterns, and infra limits.
  - Also weak: *claiming* that concurrency or performance work holds up in production when it can't be measured here (implementing it is a strength; proving it without a benchmark or load test is not), and anything else Claude can't verify.
  - If a subtask depends on any of these, mark it **Augment** or **Own**, or ask the user to provide the source (ticket, Figma link, flow diagram, ADR) before it can be automated.
- **Verification available?** Check whether tests, a type checker, a linter, or a runnable app exist. Work Claude can't verify should get more human involvement.
- **Context limits:** very large changes may need to be split into sessions or subagents.

## 3. Task delegation: assign each part a mode

Break the task into 3–8 concrete subtasks. Give each one a mode. The first three are the AI Fluency interaction modes; **Own** is added for work that should stay with the user.

| Mode | Meaning | Good fit |
|---|---|---|
| **Automate** | Claude does it end to end in this session; the user reviews the result | Well-specified, verifiable, low-risk |
| **Augment** | Claude and the user think it through together (Claude drafts, user decides) | Design choices, tradeoffs, ambiguous requirements |
| **Agency** | Claude is set up to act independently over time or for others: background or sub-agents, scheduled jobs, CI bots, agents that triage issues or review PRs | Repeated work with clear rules and guardrails, where the setup is reviewed once and the runs are monitored |
| **Own** | The user does it, or decides it, without Claude | Product judgment, credentials or production access, things the user wants to learn deeply |

Also flag any subtask the user should do themselves **for learning reasons**. If the user is trying to build a skill, fully automating it works against that goal.

## 4. Output

Reply with:

1. **Goal**: one or two sentences.
2. **Delegation table**: subtask | mode | why | how it will be verified | needs from user. In "needs from user", put missing sources (ticket, Figma, flow diagram, ADR), decisions only the user can make, or "learning" if the user should do it themselves to build the skill. Leave it blank when nothing is needed.
3. **Open questions**: only the ones that block the plan. Number them.
4. **Suggested next step**: usually "run the description skill on the first Automate/Augment subtask", or answer the open questions first.

Keep it short enough to read in under a minute. End by asking the user to confirm or adjust the split. Don't proceed on your own.
