# 4D Framework Enhanced

Claude Code skills based on the **AI Fluency 4D framework**: **Delegation, Description, Discernment, Diligence**, adapted for day-to-day coding.

This work is based on Anthropic's AI Fluency courses on Claude Academy, developed with Prof. Joseph Feller (University College Cork) and Prof. Rick Dakan (Ringling College). The skills turn the framework's four competencies and its three interaction modes (automation, augmentation, agency) into concrete steps for coding work. To learn the framework itself:

- [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations): the course that introduces the 4D framework
- [Claude Academy](https://academy.claude.com/): all of Anthropic's courses

| Command | When | What it does |
|---|---|---|
| `/delegation <task>` | Before starting | Splits the task into subtasks and gives each a mode: *Automate*, *Augment*, *Agency*, or *Own*. Weighs risk, what can be verified, and context that lives outside the repo (stakeholder, design, and flow agreements) |
| `/description <request>` | Before Claude writes code | Turns a rough ask into a brief: **Product** (what), **Process** (how), **Performance** (how Claude behaves, by mode), plus numbered acceptance criteria, out of scope, guardrails, a supply chain check for third-party code, and the shape of the final report |
| `/discernment [target]` | After Claude writes code | Skeptical review: checks each acceptance criterion, the final report against reality, the diff against scope and guardrails, and the reasoning and collaboration. Gives a verdict with ranked findings, each marked as a brief problem or a code problem |
| `/diligence [target]` | Before commit / PR / deploy | Pre-ship gate: appropriate AI use (data shared, secrets, supply chain, licenses), honest disclosure (drafts the PR note), and ownership (explain-it-back, rollback, monitoring). Never ships anything itself |
| `/cycle <task>` | Whole task | Runs all four in order, per subtask and by mode, with a checkpoint after each phase and a final review of the combined change |

## How the pieces connect

- **Modes.** Delegation assigns each subtask a mode, and every later skill adapts to it. *Automate*: Claude does it end to end. *Augment*: Claude presents options and you decide. *Agency*: Claude sets up an agent that acts on its own, with enforced limits. *Own*: you do it.
- **Small tasks.** Delegation can classify a task as small, using risk first and size last. The other skills then use a light version: a 2–3 line brief and quick checks, without skipping verification or ownership.
- **The description–discernment loop.** Discernment checks the work against the brief. When something's wrong, it decides whether the brief or the code was at fault. After two failed rounds, the task goes back to delegation for a different mode.
- **Guardrails are instructions, not technical limits.** For rules that must never be broken, back them with Claude Code permission deny rules or hooks. [skills/description/guardrails.md](skills/description/guardrails.md) has a starter deny list for `.claude/settings.json`.

## Token economics

**What gets loaded, and when** (approximate, at ~4 characters per token):

| Item | Loaded when | ~Tokens |
|---|---|---|
| Skill descriptions | Every session, so Claude knows the skills exist (`cycle`'s is hidden: it's user-invoked only) | ~300 total |
| `delegation` | Invoked | ~1,900 |
| `description` | Invoked | ~4,400 |
| ↳ `guardrails.md` | Only when a brief is saved, handed to a subagent, or the mode is Agency | ~800 |
| ↳ `supply-chain.md` | Only when the task adds or runs third-party code | ~500 |
| `discernment` | Invoked | ~2,600 |
| `diligence` | Invoked | ~2,000 |
| `cycle` | Invoked; each phase's skill is read only when that phase starts | ~1,100 + phases |
| **Full `/4d:cycle` run** | All phases plus a saved brief | **~13,000** |

A loaded skill stays in the conversation and is re-read on every later turn, mostly from the prompt cache at a fraction of the normal input price. The skill text is rarely the big cost. The big costs are the work and the output, and the skills keep those down with these rules:

| Cost driver | Rule that controls it | Skill |
|---|---|---|
| **Rework rounds** (the most expensive: redo, re-test, re-review) | Coverage check: every promise in the brief maps to an acceptance criterion before work starts | description |
| Verification depth | Run each check once; probes and deliberately breaking the code only for risky criteria or weak-looking tests | discernment |
| Re-running unchanged checks | Each review ends with a one-line **verified state** (`git diff --stat` + results); later phases reuse it if the diff is identical | discernment, cycle, diligence |
| Command output | Keep summary lines (counts, failures), not full logs | discernment |
| Repeated reports | Checkpoints show only what's new; the brief is referenced by path, not reprinted | cycle |
| Reference text needed only sometimes | Kept in side files and read on demand | description |
| Small tasks | Short path: no full brief, light checks only | all |

**Measured on the TASK-42 example** (`/4d:cycle`, before and after these rules):

| | Before | After |
|---|---|---|
| Review rounds | 2 (a missed edge case forced a brief revision) | 1 |
| Deliberate-break test runs | 4 | 1, targeted |
| Test suite re-runs after review | In every later phase | Reused the verified state |

**Don't save tokens on the brief.** Every failure found in testing came from an under-specified brief, and one extra rework round costs more than the whole description skill.

## Install

**From the marketplace** (recommended; commands are namespaced, e.g. `/4d:discernment`):

```sh
claude plugin marketplace add pedrobertao/4D-framework-enhanced
claude plugin install 4d@4d-framework
```

Update later with `claude plugin update 4d@4d-framework`.

**From a local clone** (for one session, e.g. while changing the skills):

```sh
claude --plugin-dir /path/to/this/repo
```

**As personal skills** (short names like `/discernment`): copy the folders into your user skills directory:

```sh
cp -r skills/* ~/.claude/skills/
```

Or copy them into a project's `.claude/skills/` to share them with your team.

## Try it

[examples/TESTING.md](examples/TESTING.md) walks through five scenarios on a tiny sample API (`examples/tasks-api`), with traps for each skill to catch.

## Layout

```
.claude-plugin/plugin.json
.claude-plugin/marketplace.json  # lets users install with `claude plugin install`
skills/
  delegation/SKILL.md
  description/SKILL.md
  description/guardrails.md     # standard guardrails, read on demand
  description/supply-chain.md   # third-party checks, read on demand
  discernment/SKILL.md
  diligence/SKILL.md
  cycle/SKILL.md  # orchestrator, user-invoked only
```

## Feedback

Feedback is welcome, especially from real use on your own code. [Open an issue](https://github.com/pedrobertao/4D-framework-enhanced/issues/new/choose) and pick a template:

- **A skill that got it wrong:** it missed a problem, raised a false alarm, skipped a checkpoint, or picked the wrong mode
- **Too much process or too many tokens** for the size of the task
- **Ideas:** new scenarios, board integrations, or anything from [TODO.md](TODO.md) you'd like prioritized

It helps to include the command you ran (e.g. `/4d:discernment`), what you expected, and what Claude actually did. A pasted excerpt of the output is enough. Remove any secrets or private code first.

## License

[MIT](LICENSE)
