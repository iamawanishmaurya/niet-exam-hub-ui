---
phase: 5
plan: 1
wave: 1
depends_on: [4]
files_modified: [
  "src/hooks/useExamPapers.ts"
]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "PDF previews and downloads correctly map to existing files in the remote GitHub repos"
  artifacts:
    - "Fixed useExamPapers.ts"
---

# Plan 5.1: Fix GitHub Raw URL Mapping (404 Issue)

<objective>
Fix the URL generation logic in `useExamPapers.ts` to correctly map the legacy JSON paths (which include `assets/` or `pptx/Ppt/` prefixes) to the actual root structure present in the mapped GitHub repos.

Purpose: The GitHub mapped repos contain directories like `cop/` and `exam/` and `Semester I/` at their roots. But the internal JSON uses `assets/cop/...` and `/pptx/Ppt/Semester I/...`. Stripping these prefixes dynamically will properly map to the raw files.
Output: Repaired paths pointing directly to `https://raw.githubusercontent.com/...`
</objective>

<context>
Load for context:
- src/hooks/useExamPapers.ts
</context>

<tasks>

<task type="auto">
  <name>Sanitize generated GitHub paths</name>
  <files>src/hooks/useExamPapers.ts</files>
  <action>
    Locate the `normalizeExtractedData` function.
    In the mapping callback for `processedPaths`, update the path string formatting. If `mode === "exam"`, strip any leading `assets/`. If `mode === "ppt"`, strip any leading `pptx/Ppt/`.
  </action>
  <verify>grep -q "slice" src/hooks/useExamPapers.ts</verify>
  <done>Generated URLs perfectly align with the external GitHub directory structures.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] No 404s present when fetching raw URL. Verify logic matches string formatting properly.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
