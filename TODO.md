# TODO

## 1. Improve token economics
- [ ] Measure real token usage per run (e.g. headless runs with JSON output) and replace the estimates in the README
- [ ] Track tokens per scenario over time, so a skill change that adds cost shows up
- [ ] Keep the small-task criteria in one place; they're currently duplicated in delegation and description
- [ ] Split discernment and diligence the same way as description: keep the core in `SKILL.md`, move rarely used sections (Agency checks, supply chain fallback) to side files
- [ ] Let cycle read only the "Small task" section of a skill instead of the whole file
- [ ] Optional: run discernment in a subagent for tasks that aren't small (more independent, but costs more tokens). Measure before making it the default

## 2. Broaden examples
- [ ] Scenarios for the modes never tested: Augment, Agency, and Own
- [ ] A scenario where the source of truth is a design or flow, not a ticket
- [ ] A supply-chain scenario with a typosquatted package name
- [ ] A frontend example (UI states, copy, accessibility) next to `tasks-api`
- [ ] A Python example, so the skills aren't only tried on Node
- [ ] A scenario that tests the blast-radius rule: a parameter that used to be ignored and is now rejected
- [ ] TESTING.md: say to use a new chat for each scenario, because earlier runs influence later ones
- [ ] Automate scoring: run each scenario headless and compare the output with `ANSWER_KEY.md`

## 3. Integrations with popular boards
Jira, Linear, GitHub Issues/Projects, Azure Boards, Trello, Asana. Prefer each board's MCP server or CLI (e.g. `gh`) over custom code.
- [ ] **Read (delegation, description):** given a ticket key or link, pull the title, description, acceptance criteria, status, linked issues, and comments, and use them as the source of truth. Read only the fields needed, to keep tokens down
- [ ] **Map to the brief:** turn the ticket's acceptance criteria into numbered ACs, and its "agreed / open" items into scope and ⚠️ assumptions
- [ ] **Stakeholders:** take the reporter, assignee, and people in the comments as the "who agreed" for delegation
- [ ] **Write back (diligence):** offer to create follow-up tickets, link the PR to the ticket, and post a short summary of the review. Always show the exact content and wait for the user's approval, since this publishes to a shared board
- [ ] **No silent status changes:** never move a ticket (e.g. to "In review" or "Done") without the user asking
- [ ] Document setup per board in the README, and degrade gracefully when no board is connected (paste the ticket text instead)
- [ ] Add a board-backed example scenario (e.g. a GitHub issue instead of `docs/tickets/TASK-42.md`)

## Skill fixes found in testing
- [ ] `guardrails.md`: say where the supply chain check lives ("the description skill's `supply-chain.md`"), so a saved brief doesn't point to a file its reader can't find
- [ ] description: every ⚠️ assumption still needs an AC. In the last run, two (repeated params, unknown params) had none
- [ ] discernment: check that a saved brief is complete (full guardrails list, every ⚠️ assumption mapped to an AC), not just the code against the brief
- [ ] delegation: name the person or team behind each agreement (e.g. "Product (Ana)"). It does this in some runs and not others
- [ ] Ship enforcement with the plugin (hooks or a settings template) instead of only suggesting deny rules
