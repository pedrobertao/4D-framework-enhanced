---
name: 4-diligence
description: Pre-ship responsibility check for AI-assisted code — appropriate AI use, transparency about AI involvement, and the developer's ownership of what gets deployed. Use before committing, opening a PR, merging, or deploying AI-assisted work, or when the user asks "is this ready to ship?".
argument-hint: "[what is about to ship — defaults to current changes]"
---

# Diligence: take responsibility for what you ship

Diligence is the fourth of the 4Ds of AI Fluency. AI helped write it, but the developer owns it. This skill is a short, honest pre-ship gate. It is not a code review; the discernment skill does that first.

Target: **$ARGUMENTS**

If no target was given, use the current changes (`git diff` / `git diff --staged`, or the files changed in this conversation).

## 0. Entry gate

- **Discernment verdict:** find the latest discernment review of this change.
  - **Rework**, or Blockers still open → status is **Not ready**. Stop here and say why.
  - **Accept with fixes** → confirm the fixes were actually applied.
  - **No review found** → say so. For anything beyond a small task, recommend running the discernment skill first, and continue only if the user wants to.
- **Stale review:** if files changed after the discernment review, list them. Those changes were never reviewed.
- **Context:** pick up the brief, the Final report, the delegation mode, and whether it's a small task.

## 1. Small task? Use the light check

If the task was classified as small, check only:
1. No secrets or personal data in the diff.
2. The check command passed on the **final** version.
3. AI involvement disclosed per the team's convention (draft the one-line note).
4. One explain-it-back question about the change, put to the user.

Then give the status. If anything looks off, switch to the full check.

## 2. Creation diligence: was AI used appropriately?

- **Data shared with the AI:** were secrets, credentials, customer or personal data, production logs, or proprietary code pasted into the conversation or sent through tools (MCP servers, web services) in ways the org or project wouldn't allow? Look back over the conversation, not only the diff.
- **Secrets in the change:** scan the diff, test fixtures, and logs for tokens, keys, passwords, `.env` values, and personal data.
- **Supply chain (last line of defense):** if the change touches a manifest, lockfile, GitHub Actions, Dockerfile, CDN script, or install script:
  - Confirm the supply chain check from the brief was done and reported.
  - If it wasn't, run the key checks now: the name is the real package (not typosquatted or invented), release age, install scripts, pinned versions or SHAs/digests, and audit tool results (`npm audit`, `pip-audit`, `cargo audit`, `osv-scanner`).
  - Any unresolved problem here means **Not ready**.
- **Licensing and provenance:** does any substantial block look copied from a known source with an incompatible license? Are new dependencies' licenses compatible?
- **Policy:** does the project or employer have AI-usage rules (CONTRIBUTING, CLAUDE.md, PR templates)? Are they followed?

## 3. Transparency diligence: is AI involvement disclosed where it should be?

- **Team convention first:** check CONTRIBUTING, PR templates, and recent commits for how AI help is disclosed (e.g. a `Co-Authored-By` trailer, a PR label, a note). Follow that. Don't invent a convention.
- **Draft the PR/commit note** from the Final report and the discernment review. Keep it to a few lines:
  - which areas were AI-written and deserve extra scrutiny;
  - what was verified, and how (test names, commands);
  - what was **not** verified;
  - known limitations and follow-ups.
- **No overstatement:** only claim what was actually checked. "Tests pass" must mean they ran on the final version.
- **Follow-ups become tracked work:** suggest turning each follow-up into a ticket or issue so it isn't lost in a chat log.
- **Agency mode:** the agent's actions must be identifiable (a bot account, a label, or a marker in its commits and comments), so people know when they're dealing with an agent.

## 4. Deployment diligence: can the user stand behind it?

This is the most important section. Put the questions to the **user**; don't answer them for them.

- **Explain-it-back test:** pick the 1–3 riskiest or most complex pieces, using the discernment findings and anything touching auth, data, money, or public contracts. For each, ask the user to explain briefly:
  - what it does and why it's done this way;
  - how it could fail.

  If they can't, offer a walkthrough before shipping. It's also a signal for next time: mark similar subtasks **Own** (for learning) in the delegation skill.
- **Unverified items:** list every ⚠️ not-verified item from the discernment review. The user must accept each one explicitly, or have it verified first. Silence doesn't count as acceptance.
- **Verification on the final version:** were tests, build, and lint run after the last change? Is the new behavior covered by tests?
- **Blast radius:** what breaks if this is wrong, and who is affected (users, other teams, data)?
- **Rollback:** how is it reverted (revert commit, feature flag, migration down-path)? For irreversible changes (data migrations, deletions, external messages), has the rollback or backup actually been tested? If not, that's at least ⚠️.
- **Safe release:** for risky changes, suggest a feature flag, staged rollout, or canary.
- **Monitoring:** how will you know it's broken in production (logs, metrics, alerts, error tracking)? Who watches it after release?
- **Ownership:** who owns this code from now on, and who is on call if it breaks?
- **Downstream impact:** docs, changelog, API consumers, migrations, config, or runbooks that need updating.

## 5. Agency mode: before turning an agent on

If the subtask's mode is Agency, also confirm:
- **Enforced limits:** the critical guardrails are backed by permission deny rules or hooks, not only instructions.
- **Caps and dry run:** per-run caps are set, and a dry run has been reviewed.
- **Kill switch:** there's a way to stop it, and it has been tested.
- **Logging:** every run records what the agent did.
- **Watching early runs:** a named person reviews the first few runs before it runs unwatched.

## 6. Output

Reply with:
1. **Checklist:** ✅ / ⚠️ / ❌ for the entry gate, creation, transparency, deployment, and (if relevant) Agency, with a short note on each ⚠️ and ❌.
2. **Questions for the user:** the explain-it-back questions and the unverified items to accept.
3. **Draft PR/commit note**, ready to paste.

End with a status, using this rule:
- **Not ready:** discernment said Rework or wasn't run on a risky change, secrets were found, a supply chain problem is unresolved, the user can't explain the riskiest part, or an irreversible change has no tested rollback.
- **Ready after the items above:** only ⚠️ items remain, each with a clear action.
- **Ready to ship:** everything is ✅, and the user has accepted any unverified items.

The final call belongs to the user. Never commit, push, merge, or deploy from this skill.
