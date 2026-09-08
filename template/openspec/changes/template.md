# Change: [Short Title of the Feature / Refactor]

## 1. Context & Motivation
Describe why this change is necessary, what problem it solves, or what new capability it introduces.

## 2. Proposed Changes
High-level description of modified files, new screens, new stores, or new components.

- `packages/core/...`: [Changes to stores/repositories/network]
- `packages/ui/...`: [Changes or additions to UI components]
- `src/...`: [Screens, ViewModels, or Navigation changes]

## 3. Spec Delta
Describe which existing specs in `openspec/specs/` are affected and what requirements are added or modified:
- `specs/architecture/spec.md`: [N/A or delta details]
- `specs/state-management/spec.md`: [N/A or delta details]
- `specs/navigation/spec.md`: [N/A or delta details]
- `specs/ui-components/spec.md`: [N/A or delta details]
- `specs/network-and-cache/spec.md`: [N/A or delta details]

## 4. Implementation Tasks
- [ ] 1. Create/update MST store or repository
- [ ] 2. Create ViewModel hook
- [ ] 3. Create View component using `@app/ui`
- [ ] 4. Register in navigation
- [ ] 5. Typecheck & lint validation (`yarn tsc -p tsconfig.json --noEmit && yarn lint`)

## 5. Verification & Testing
- Steps taken to verify on Android & iOS
- Typecheck status
- Manual test results
