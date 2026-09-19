---
description: 'Repository-wide commenting, documentation, and TypeScript standards'
applyTo: '**/*.{ts,astro,css}'
---

# Coding Standards

These standards apply to all application code and complement the technology-specific
instructions in this directory.

## Comments and documentation

- Comment intent, constraints, and non-obvious decisions — explain **why** the
  code exists rather than restating **what** the code does.
- Do not add comments that merely paraphrase the next line or describe an
  obvious implementation detail.
- Keep comments concise and update or remove them whenever the related code
  changes. An outdated comment is a bug.
- Prefer names and types that make routine behavior self-explanatory. Use a
  comment when the rationale cannot be expressed clearly in the code itself.

## TypeScript

- Use TypeScript for application logic and give every function parameter and
  return value an explicit type, especially in `db/` and `src/lib/`.
- Use the repository's existing four-space indentation, double-quoted imports
  and strings where the surrounding file uses them, semicolons, and trailing
  commas in multiline structures.
- Keep one logical declaration per line when it improves readability; wrap
  long signatures and object literals rather than relying on horizontal
  scrolling.
- Prefer narrow, inferred types for local values and explicit interfaces or
  type aliases for public contracts. Do not use `any` to bypass type checking.
- Preserve the project's formatting conventions when editing an existing file;
  do not reformat unrelated code.

## Public APIs

- Every exported function in `db/` and `src/lib/` must have a TSDoc/JSDoc
  comment describing its purpose, each parameter, and its return value.
- Document injectable `db` parameters explicitly so callers understand whether
  the helper uses the production database or a test database.
- Each reusable `.astro` component must document its `Props` interface,
  including the purpose of each prop and any optional/default behavior.
- Keep public API documentation adjacent to the declaration it describes.

See [`drizzle.instructions.md`](drizzle.instructions.md) for data-layer
documentation examples and [`astro.instructions.md`](astro.instructions.md) for
component contract examples.
