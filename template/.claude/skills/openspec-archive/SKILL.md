---
name: openspec-archive
description: Finalize, sync, and archive a completed OpenSpec change proposal into openspec/changes/archive/.
---

# OpenSpec: Archive Skill (`/opsx:archive`)

Use this skill once all tasks in a change proposal have been implemented, verified, and approved.

## Purpose
The `archive` phase moves finished proposals into historical records while ensuring all documentation, delta specs, and task lists are fully reconciled with the main codebase.

## Step-by-Step Workflow

### 1. Pre-Archive Verification
Before archiving, confirm:
1. All checkboxes in `openspec/changes/<change-name>/proposal.md` are marked `[x]`.
2. TypeScript build succeeds without errors: `yarn tsc -p tsconfig.json --noEmit`.
3. ESLint checks pass: `yarn lint`.

### 2. Auto-Sync Delta Specs
Ensure any delta specs in `openspec/changes/<change-name>/specs/` are synchronized into `openspec/specs/`. The archive command does this automatically:
```bash
yarn opsx archive <change-name>
```

### 3. Folder Movement
The CLI moves the directory:
```
openspec/changes/<change-name>/ ───> openspec/changes/archive/<change-name>/
```

### 4. Git Check
Verify git status:
```bash
git status
```
The active change folder is archived, base specs are updated, and no orphan changes remain.
