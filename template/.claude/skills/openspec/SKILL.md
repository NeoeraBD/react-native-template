---
name: openspec
description: Spec-Driven Development (SDD) workflow for proposing, applying, verifying, and archiving software changes using OpenSpec.
---

# OpenSpec Spec-Driven Development (SDD) Skill

This skill guides AI agents through the Spec-Driven Development workflow using OpenSpec. All architectural modifications, features, and non-trivial refactors must adhere to this lifecycle.

## Slash Commands & Workflows

### 1. `/opsx:propose <change-name>`
Use this command to create a new change proposal.
1. Read relevant existing specifications in `openspec/specs/`:
   - `architecture/spec.md`
   - `state-management/spec.md`
   - `navigation/spec.md`
   - `ui-components/spec.md`
   - `network-and-cache/spec.md`
2. Create a proposal directory: `openspec/changes/<change-name>/`
3. Generate `proposal.md` using the template at `openspec/changes/template.md`:
   - **Context & Motivation**: Why is this change needed?
   - **Proposed Changes**: Exact list of files to add or edit.
   - **Spec Delta**: Specific lines or sections added/modified in domain specs.
   - **Implementation Tasks**: Checkbox list of tasks.
4. If the OpenSpec CLI is installed, run `yarn opsx propose <change-name>`.

### 2. `/opsx:apply <change-name>`
Use this command to execute an approved change proposal.
1. Read `openspec/changes/<change-name>/proposal.md`.
2. Implement each task in sequence:
   - Create/update MST store or repository in `packages/core/`.
   - Create ViewModel hook in `src/screens/<feature>/`.
   - Create View component using `@app/ui` components in `src/screens/<feature>/`.
   - Wire route into navigation in `src/navigation/`.
3. Mark checklist tasks as completed `[x]`.

### 3. `/opsx:verify`
Use this command to validate the implementation against TypeScript strict mode and linting:
```bash
# In template/ or project root
yarn tsc -p tsconfig.json --noEmit
yarn lint
```
Address any compile errors, missing types, or lint issues before proceeding.

### 4. `/opsx:archive <change-name>`
Use this command when tasks and verification are complete:
1. Copy/merge the approved spec delta into the permanent specifications in `openspec/specs/`.
2. Move `openspec/changes/<change-name>/` to `openspec/changes/archive/<change-name>/`.
3. If the OpenSpec CLI is installed, run `yarn opsx archive <change-name>`.
