---
name: openspec-sync
description: Synchronize delta specifications from an active OpenSpec change proposal into the project's base specifications in openspec/specs/.
---

# OpenSpec: Sync Skill (`/opsx:sync`)

Use this skill to merge delta specifications from `openspec/changes/<change-name>/specs/` into the Main Specs in `openspec/specs/`.

## Purpose
The `sync` phase prevents documentation rot. As features and APIs evolve, the Main Specifications remain the living, authoritative Source of Truth for human developers and future AI agent sessions.

## Step-by-Step Workflow

### 1. Identify Delta Specs
Locate all delta specs within the active change proposal:
`openspec/changes/<change-name>/specs/<domain>/spec.md`

Common domains:
- `architecture`: New layer conventions or patterns
- `state-management`: New MST stores, persistence rules
- `navigation`: New navigators, route param additions
- `ui-components`: New reusable components or prop modifications
- `network-and-cache`: New API endpoints, cache strategies

### 2. Run Sync Command or Merge Manually
Execute the sync command:
```bash
yarn opsx sync <change-name>
```

Or perform intelligent content merging:
1. For existing domain specs in `openspec/specs/<domain>/spec.md`:
   - Append or update new sections, APIs, and example snippets.
   - Update component tables or endpoint lists.
2. For entirely new domains:
   - Create `openspec/specs/<new-domain>/spec.md`.

### 3. Update High-Level Project Context
If the change introduced new packages, global dependencies, or altered monorepo structure:
- Update `openspec/project.md` to reflect the changes.

### 4. Verify Spec Consistency
Verify that no contradictory requirements or stale code examples remain in the updated base specs.
