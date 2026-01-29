# TRUTH GATES

**Enforcement protocol for autonomous agents working in listcart-prod**

---

## The #1 Rule: Truth > Confidence

**"No probe = no belief"**

**"No build = no commit. No exceptions."**

An agent cannot claim a change is "done" without verified proof.

---

## Stage Gate Flow

### Stage 1: Branch + Patch Edits
- Work on a feature branch (never directly on `main`)
- Make your code changes
- Save all edits

### Stage 2: Run Truth Gate
**MANDATORY before any commit:**
```bash
./scripts/truth-gate.sh
```

This runs:
1. `git status --porcelain` (show what changed)
2. `npm run build` (verify it compiles)
3. Logs output to `/tmp/build.log`
4. Shows last 20 lines of build output
5. Shows SHA256 hash of build log

### Stage 3: Commit (Only After Pass)
**Requirements:**
- Truth Gate must pass (exit code 0)
- Include proof in commit message or agent response:
  - Last 20 lines of build output, OR
  - SHA256 hash of `/tmp/build.log`

**No proof = no commit.**

### Stage 4: Push Branch (Never Push Main)
- Push your feature branch: `git push origin feature-name`
- **NEVER** push directly to `main` or `master`
- The pre-push hook will block direct pushes to main

---

## Proof Requirements

When reporting "done" to the human, the agent MUST include:

**Option A:** Last 20 lines of build output
```
Route (app)
┌ ○ /
├ ○ /_not-found
...
✓ Generating static pages using 7 workers (14/14) in 136.1ms
```

**Option B:** Build log hash
```
SHA256: a3f2b9c8d1e4f5a6b7c8d9e0f1a2b3c4...
```

---

## Hard Stop Protocol

**If the same build fails twice:**

1. **STOP immediately**
2. **Report the error** to the human with full stack trace
3. **Propose a fix** but do NOT commit
4. **Wait for human approval**

**Do not:**
- Attempt a third build without human intervention
- Commit broken code
- Push to main to "fix it later"
- Skip the Truth Gate

---

## Setup (One-Time on EC2)

Run this once to install git hooks:
```bash
chmod +x scripts/install-git-hooks.sh
./scripts/install-git-hooks.sh
```

This installs:
- **pre-commit hook:** Runs Truth Gate before every commit
- **pre-push hook:** Blocks direct pushes to main/master

---

## Truth Gate Output Example

```bash
$ ./scripts/truth-gate.sh

=== TRUTH GATE ===
Repo: /home/ubuntu/repos/listcart-prod
Branch: feature/add-navbar-fix

== git status (porcelain) ==
M components/Navbar.tsx

== npm run build ==
✓ Compiled successfully in 4.2s
...
✓ Generating static pages using 7 workers (14/14) in 138.9ms

=== BUILD PROOF (last 20 lines) ===
Route (app)
┌ ○ /
├ ○ /_not-found
...
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

=== BUILD LOG HASH ===
a3f2b9c8d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0  /tmp/build.log

=== TRUTH GATE PASS ===
```

---

## Enforcement

**This is not optional.**

The agent workflow REQUIRES:
1. Truth Gate pass before commit
2. Proof in response/commit
3. Branch workflow (no direct main commits)
4. Hard stop on repeated failures

**Why?**
- Prevents broken builds from reaching production
- Provides audit trail of what was tested
- Forces agent to verify before claiming "done"
- Catches issues locally before Vercel deployment

---

**Last Updated:** 2026-01-30  
**Status:** Active enforcement protocol

