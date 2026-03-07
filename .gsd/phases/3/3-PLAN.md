---
phase: 3
plan: 1
wave: 1
depends_on: [2]
files_modified: [
  "assets/",
  "public/pptx/"
]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Local PDF and PPT directories are removed to reduce repository size"
  artifacts: []
---

# Plan 3.1: Clean up local assets

<objective>
Remove the old local static PDF and PPT files that have been migrated and pushed to the new GitHub repositories.

Purpose: To drastically reduce the repository and footprint sizes so pushes are not bottlenecked and developers don't have to check out GBs of static files.
Output: Removal of `assets/` and `public/pptx/` folders.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Delete local static folders</name>
  <files>assets/, public/pptx/</files>
  <action>
    Remove the `assets/` and `public/pptx/` directories locally. If they are tracked by git, ensure they are removed via `git rm -r` and committed, or just `rm -rf` and add to commit. Note `public/pptx` is inside public. Just remove the whole chunks. Note there is some `assets` folder mapping which used to be inside `public/assets` maybe. Actually the user's `du -sh assets` showed an `assets/` directory at the root. Verify this!
  </action>
  <verify>test ! -d assets && test ! -d public/pptx</verify>
  <done>Local static files removed successfully.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [x] No large static PDFs/PPTs in the tree.
</verification>

<success_criteria>
- [x] All tasks verified
- [x] Must-haves confirmed
</success_criteria>
