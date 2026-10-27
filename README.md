# 4D Framework Enhanced

Claude Code skills based on the **AI Fluency 4D framework** (Anthropic Academy): **Delegation, Description, Discernment, Diligence**, adapted for day-to-day coding.

| Command | When | What it does |
|---|---|---|
| `/1-delegation <task>` | Before starting | Splits the task into subtasks and gives each a mode: *Automate*, *Augment*, *Agency*, or *Own*. Weighs risk, what can be verified, and context that lives outside the repo (stakeholder, design, and flow agreements) |
| `/2-description <request>` | Before Claude writes code | Turns a rough ask into a brief: **Product** (what), **Process** (how), **Performance** (how Claude behaves, by mode), plus numbered acceptance criteria, out of scope, guardrails, a supply chain check for third-party code, and the shape of the final report |
| `/3-discernment [target]` | After Claude writes code | Skeptical review: checks each acceptance criterion, the final report against reality, the diff against scope and guardrails, and the reasoning and collaboration. Gives a verdict with ranked findings, each marked as a brief problem or a code problem |
| `/4-diligence [target]` | Before commit / PR / deploy | Pre-ship gate: appropriate AI use (data shared, secrets, supply chain, licenses), honest disclosure (drafts the PR note), and ownership (explain-it-back, rollback, monitoring). Never ships anything itself |
| `/5-full-loop <task>` | Whole task | Runs all four in order, per subtask and by mode, with a checkpoint after each phase and a final review of the combined change |

## How the pieces connect

- **Modes.** Delegation assigns each subtask a mode, and every later skill adapts to it. *Automate*: Claude does it end to end. *Augment*: Claude presents options and you decide. *Agency*: Claude sets up an agent that acts on its own, with enforced limits. *Own*: you do it.
- **Small tasks.** Delegation can classify a task as small, using risk first and size last. The other skills then use a light version: a 2–3 line brief and quick checks, without skipping verification or ownership.
- **The description–discernment loop.** Discernment checks the work against the brief. When something's wrong, it decides whether the brief or the code was at fault. After two failed rounds, the task goes back to delegation for a different mode.
- **Guardrails are instructions, not technical limits.** For rules that must never be broken, back them with Claude Code permission deny rules or hooks.

## Install

**As a plugin** (commands are namespaced, e.g. `/4d-framework-enhanced:3-discernment`):

```sh
claude --plugin-dir /path/to/this/repo
```

**As personal skills** (short names like `/3-discernment`): copy the folders into your user skills directory:

```sh
cp -r skills/* ~/.claude/skills/
```

Or copy them into a project's `.claude/skills/` to share them with your team.

## Try it

[examples/TESTING.md](examples/TESTING.md) walks through five scenarios on a tiny sample API (`examples/tasks-api`), with traps for each skill to catch.

## Layout

```
.claude-plugin/plugin.json
skills/
  1-delegation/SKILL.md
  2-description/SKILL.md
  3-discernment/SKILL.md
  4-diligence/SKILL.md
  5-full-loop/SKILL.md  # orchestrator, user-invoked only
```
