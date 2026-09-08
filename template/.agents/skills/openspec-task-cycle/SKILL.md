---
name: openspec-task-cycle
description: Concurrently or sequentially executes tasks from an OpenSpec context file through the full OpenSpec lifecycle (Claim -> Propose -> Apply -> Archive -> Update Status -> Repeat) with multi-agent concurrency support, atomic task claiming, and real-time status tracking.
allowed-tools: Bash(openspec:*), Bash(yarn:*), Bash(npx:*), Bash(git:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: sohan
  version: '2.0'
---

Execute tasks from an OpenSpec context file with **multi-agent concurrency** and **real-time status tracking**:
**Context Task List -> Atomic Claim -> Propose -> Apply -> Archive -> Update Status -> Repeat**

This skill automates continuous change-driven development for single or multiple concurrent agents. Multiple worker agents can run simultaneously without colliding by using an atomic task-claiming protocol, isolated changes, and dedicated branch workspaces.

---

## Concurrency & Status Architecture

```
                                Context File
                        (Master Task Checklist & Status)
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
   Worker Agent 1               Worker Agent 2               Worker Agent 3
 (Role: Worker-A)             (Role: Worker-B)             (Role: Worker-C)
         │                            │                            │
 1. Scan for PENDING          1. Scan for PENDING          1. Scan for PENDING
    "- [ ] Task 1.1"             "- [ ] Task 1.2"             "- [ ] Task 1.3"
         │                            │                            │
 2. PERMISSION GATE:          2. PERMISSION GATE:          2. PERMISSION GATE:
    Ask User Permission          Ask User Permission          Ask User Permission
    (User Approves)              (User Approves)              (User Approves)
         │                            │                            │
 3. ATOMIC CLAIM:             3. ATOMIC CLAIM:             3. ATOMIC CLAIM:
    "- [/] ... [IN_PROGRESS]"    "- [/] ... [IN_PROGRESS]"    "- [/] ... [IN_PROGRESS]"
    (Record Start Time & Token)  (Record Start Time & Token)  (Record Start Time & Token)
         │                            │                            │
 4. AUTO-PASS PIPELINE:       4. AUTO-PASS PIPELINE:       4. AUTO-PASS PIPELINE:
    Propose -> Apply & Test      Propose -> Apply & Test      Propose -> Apply & Test
    -> Archive & Sync            -> Archive & Sync            -> Archive & Sync
    (Zero user interrupts)       (Zero user interrupts)       (Zero user interrupts)
         │                            │                            │
 5. STATUS & METRICS:         5. STATUS & METRICS:         5. STATUS & METRICS:
    Report Duration & Tokens     Report Duration & Tokens     Report Duration & Tokens
    "- [x] ... [DONE]"           "- [x] ... [DONE]"           "- [x] ... [DONE]"
         │                            │                            │
    [Claim Next Task (Ask)]      [Claim Next Task (Ask)]      [Claim Next Task (Ask)]
```

---

## Task Status States

Every task in the context checklist follows this strict status lifecycle:

| Status          | Markdown Syntax                                                                                                   | Description                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **PENDING**     | `- [ ] **Task X.Y: <Title>**`                                                                                     | Unclaimed and ready for any worker to pick up (requires explicit user permission before claiming). |
| **IN_PROGRESS** | `- [/] **Task X.Y: <Title>** [IN_PROGRESS: <WorkerID> \| Started: <ISO>]`                                         | Claimed with user approval and running in auto-pass mode. Other workers MUST skip.                 |
| **DONE**        | `- [x] **Task X.Y: <Title>** [DONE: <Date> \| change: <ArchiveName> \| Duration: <Duration> \| Tokens: <Tokens>]` | Implementation complete, verified, and archived with duration and token consumption reported.      |
| **BLOCKED**     | `- [!] **Task X.Y: <Title>** [BLOCKED: <WorkerID> \| reason: <Summary>]`                                          | Encountered an unresolvable blocker or failure. Skipped by other workers until unblocked.          |

---

## Detailed Step-by-Step Instructions

### Step 1: Initialize Worker & Locate Context File

1. **Determine Worker Identity**:
   - Establish a unique `WorkerID` (e.g., `Worker-1`, `Worker-A`, or the agent's subagent role name).
   - Use this `WorkerID` in all claim tags, change names, and log outputs.

2. **Locate Target Context File**:
   - If user provided a specific path, use it.
   - Otherwise, default to `openspec/context/screens-uiux-tasks-and-prompts.md`, `openspec/screens-uiux-tasks-and-prompts.md`, or search `openspec/` for context markdown files.

3. **Check Active Changes for THIS Worker**:
   - Run `openspec list --json` (or `yarn opsx status`).
   - **Multi-Agent Non-Blocking Rule**: Multiple changes can exist concurrently in `openspec/changes/`. Do NOT halt just because another worker has an active change!
   - Only check if an un-archived change belonging to _this specific task/worker_ already exists. If so, resume applying or archive it before claiming a new task.

---

### Step 2: Atomic Task Claiming (First-Come, First-Served + Permission Gate)

To prevent race conditions and ensure full user oversight over task selection:

1. **Read and Scan the Context File**:
   - Look for the first task that is strictly **PENDING**:
     ```markdown
     - [ ] **Task <ID>: <Title>**
     ```
   - **Ignore** any task marked:
     - `- [x]` (Already completed)
     - `- [/]` or containing `[IN_PROGRESS]` (Claimed by another active worker)
     - `- [!]` or containing `[BLOCKED]` (Blocked)

2. **If no PENDING tasks remain**:
   - Check if any tasks are still marked `[IN_PROGRESS]`:
     - If yes: Inform the user/coordinator: "All remaining tasks are currently in progress by other workers. Standing by or exiting."
     - If no (all `- [x]`): Display: "All tasks in <context-file> are completed!" and exit cleanly.

3. **MANDATORY USER PERMISSION GATE**:
   - **Permission is Required Before Claiming**: Before writing any claim or modifying the task status, the worker MUST ask the user for explicit permission to claim that task.
   - Use the `ask_question` tool (or interactive prompt) with:
     - **Question**: "Do you want me to claim and start working on **Task <ID>: <Title>**?"
     - **Options**:
       1. `(Recommended) Approve and start Task <ID>`
       2. `Skip this task and check the next pending task`
       3. `Pause/Stop task cycle`
   - **Enforcement**:
     - If user **approves**: Proceed immediately to Atomic Claim Write (Step 2.4).
     - If user **skips**: Keep task as `PENDING`, scan for the next pending task, and ask permission for that one.
     - If user **pauses/stops**: Exit the cycle cleanly without claiming.

4. **Atomic Claim Write**:
   - **Immediately update the context file** once user permission is granted:
     ```markdown
     - [/] **Task <ID>: <Title>** [IN_PROGRESS: <WorkerID> | Started: <CurrentTime>]
     ```
   - Save the file immediately. This reserves the task across all concurrent agents.
   - **Record Task Start Metrics**: Record the current timestamp (`T_start`) and baseline token counter to measure task duration and token consumption at completion.

5. **AUTO-PASS PROTOCOL (Zero Intermediate Permissions)**:
   - **All other phases auto-pass without interruption**: Once user permission to claim the task is granted, the worker MUST execute all remaining steps automatically without asking for additional user confirmations:
     - **Propose Phase**: Auto-pass (generate proposal, spec deltas, design, tasks).
     - **Apply Phase**: Auto-pass (write code, companion styles, stores, viewmodels).
     - **Verification Suite**: Auto-pass (run typecheck, linter, scoped unit tests).
     - **Archive Phase**: Auto-pass (sync capability specs, archive change directory).
     - **Status Update**: Auto-pass (mark completed in context file).
   - Do NOT ask intermediate questions like "Should I propose changes?", "Should I apply code?", or "Should I archive?". Run the entire pipeline autonomously to completion.

6. **Extract Task Metadata**:
   - **Task Title & ID**: e.g., `Task 1.2: Payment & Settlement Modal`
   - **Figma Node**: e.g., `4820:15629`
   - **Asset References**: e.g., `openspec/assets/screens/payment.png`
   - **Target Files**: Component, Companion Style, ViewModel, Unit Tests
   - **Prompt Instructions**: Full prompt instructions from the context file.

---

### Step 3: Propose Phase (`openspec propose`)

1. **Derive Unique Change Name**:
   - Format: `task-<kebab-id>-<screen-name>`
   - Example: `task-1-2-payment-modal`
   - Distinct names ensure zero collision between concurrent workers.

2. **Create Change Directory**:

   ```bash
   yarn opsx propose "<change-name>"
   ```

3. **Generate Change Artifacts**:
   - `proposal.md`: Summary of changes, UI/UX scope, and components involved.
   - `specs/<capability>/spec.md`: Delta specification with `## ADDED Requirements` and scenarios.
   - `design.md`: Architecture, component composition, MobX store wiring, and theme tokens.
   - `tasks.md`: Discrete checklist of implementation items for this specific change.

4. **Validate Proposal**:
   ```bash
   yarn opsx verify
   ```

---

### Step 4: Apply Phase (`openspec apply`)

1. **Execute Code Changes**:
   - Follow project architectural rules:
     - **Container**: Screen container or layout from `@app/ui` (`Col`, `Row`).
     - **Headers**: `CustomHeader` from `@app/ui`.
     - **Styles**: Typed style objects consuming `useTheme()` with zero raw hex codes and zero inline untyped styles.
     - **State**: `observer` from `mobx-react-lite` reading MobX stores.
     - **Components**: Reuse existing components from `@app/ui` (31 MD3 components).
     - **Tests**: Accompanying unit tests verifying rendering, interaction, and theme integration.

2. **Run Scoped Verification Suite**:
   - In a multi-agent environment, run targeted checks:
     - **Typecheck**:
       ```bash
       yarn tsc -p tsconfig.json --noEmit
       ```
     - **Linter**:
       ```bash
       yarn lint
       ```
     - **Unit Tests**:
       ```bash
       yarn test
       ```

3. **Complete Change Tasks**:
   - Mark all tasks in `openspec/changes/<change-name>/proposal.md` as `- [x]`.

---

### Step 5: Archive Phase (`openspec archive`)

1. **Sync Delta Specs**:
   - Sync the change delta specs into the main capability specs at `openspec/specs/<capability>/spec.md`.

2. **Move to Archive**:
   ```bash
   yarn opsx archive "<change-name>"
   ```

---

### Step 6: Update Status & Loop

1. **Calculate Execution Metrics (Duration & Tokens)**:
   - **Duration**: Compute elapsed execution time from task claim start to completion: `Duration = T_end - T_start` (e.g. `4m 35s`).
   - **Token Consumption**: Track or report tokens utilized during this specific task run (e.g. `~38,500 tokens` or session token delta).

2. **Update Context File Status to DONE**:
   - In the target context file, update the claimed task line including execution metrics:
     ```markdown
     - [x] **Task <ID>: <Title>** [DONE: YYYY-MM-DD | change: <change-name> | Duration: <Duration> | Tokens: <TokenCount> | Worker: <WorkerID>]
     ```

3. **Display Iteration Progress with Duration & Tokens**:

   ```markdown
   ### ✓ Task <ID> Complete & Archived [Worker: <WorkerID>]

   - **Task:** <Task Title>
   - **Archived Change:** openspec/changes/archive/<change-name>
   - **Duration:** <elapsed time, e.g. 4m 35s>
   - **Token Usage:** <tokens consumed, e.g. ~38,500 tokens>
   - **Status:** Marked [DONE] in context file
   ```

4. **Loop to Next Task**:
   - Return to **Step 2** to scan for the next available `PENDING` task.
   - Trigger the **Mandatory User Permission Gate** before claiming it.
   - Continue until no `PENDING` tasks remain or the user pauses/stops the cycle.

---

### Error Handling & Blocker Protocol

- **If a task fails or is blocked** (e.g. unresolvable type error or missing dependency):
  1. Do NOT leave the task hanging as `[IN_PROGRESS]`.
  2. Update the task status in the context file to **BLOCKED**:
     ```markdown
     - [!] **Task <ID>: <Title>** [BLOCKED: <WorkerID> | reason: <Brief explanation>]
     ```
  3. Clean up the incomplete change: `rm -rf openspec/changes/<change-name>`.
  4. Report the blocker to the user or coordinator.
  5. Either pick the next available `PENDING` task or pause for guidance.

---

## How to Launch Multiple Agents in Parallel

When invoking multiple agents via `invoke_subagent`, launch each worker with:

1. A unique `Role` (e.g. `Worker-A`, `Worker-B`, `Worker-C`).
2. Isolated workspace: Use `Workspace: 'branch'` to prevent git working tree and compiler collisions.
3. Explicit instruction to follow `auto-task` / `openspec-task-cycle` and claim tasks atomically.

### Example Orchestrator Invocation:

```json
{
  "Subagents": [
    {
      "TypeName": "self",
      "Role": "Worker-A",
      "Workspace": "branch",
      "Prompt": "Execute openspec-task-cycle on openspec/context/tasks.md as Worker-A. Claim pending tasks atomically with permission gate, propose, apply, test, archive, and repeat."
    },
    {
      "TypeName": "self",
      "Role": "Worker-B",
      "Workspace": "branch",
      "Prompt": "Execute openspec-task-cycle on openspec/context/tasks.md as Worker-B. Claim pending tasks atomically with permission gate, propose, apply, test, archive, and repeat."
    }
  ]
}
```

---

## Master Status Tracking Dashboard (Context Header)

Optionally, workers or the coordinator maintain a quick-status dashboard at the top of the context file:

```markdown
| Task     | Worker   | Status      | Started | Completed | Duration | Tokens | Change                 |
| -------- | -------- | ----------- | ------- | --------- | -------- | ------ | ---------------------- |
| Task 1.1 | Worker-A | DONE        | 14:00   | 14:30     | 30m 00s  | ~45k   | task-1-1-order-screen  |
| Task 1.2 | Worker-B | IN_PROGRESS | 14:32   | -         | -        | -      | task-1-2-payment-modal |
| Task 1.3 | Worker-A | PENDING     | -       | -         | -        | -      | -                      |
```
