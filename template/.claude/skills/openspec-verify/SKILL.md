---
name: openspec-verify
description: Verify TypeScript strict compilation, linting rules, and OpenSpec specification conformance.
---

# OpenSpec: Verify Skill (`/opsx:verify`)

Use this skill to validate code quality, strict typing, linting rules, and conformance to specifications before committing or archiving.

## Purpose
The `verify` phase catches compilation errors, null reference vulnerabilities, loose styling types, and architectural violations early, keeping CI/CD pipelines green and production crash-free.

## Verification Checklist & Protocol

### 1. TypeScript Strict Mode Compilation
Run the TypeScript compiler:
```bash
yarn tsc -p tsconfig.json --noEmit
# Or using opsx:
yarn opsx verify
```
- **Requirements**:
  - Zero compilation errors (`Found 0 errors`).
  - No untyped parameters or loose `any` casts in ViewModel hooks or repositories.
  - No missing property definitions.

### 2. Strict Null Safety Audit
Inspect all modified and newly added files:
- **Optional Chaining (`?.`)**: Mandatory for all nested object/array property access on external API responses, navigation routes, and state stores.
- **Nullish Coalescing (`??`)**: Mandatory for fallback defaults. Loose `||` is strictly prohibited for default assignment to prevent coercion bugs with `0` or `""`.
- **API Payload Sanitization**: Repositories must map arrays with `.map((item: any) => ({ ... }))` providing robust fallback values.

### 3. Component StyleProp Safety
- Ensure custom component style overrides use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` instead of raw `ViewStyle` or `any`.

### 4. Architectural Boundary Enforcement
- **Views**: Ensure NO direct `axios`, `fetch`, `MMKV`, or non-trivial business logic exists.
- **ViewModels**: Ensure NO direct `apiClient` or raw `MMKV` calls exist.
- **Repositories**: Ensure data is cached with `offlineCache.getOrFetch()` and remote calls use `apiRequest()`.

### 5. ESLint Verification
Run the linter:
```bash
yarn lint
```
Resolve any unused imports, formatting warnings, or syntax discrepancies.
