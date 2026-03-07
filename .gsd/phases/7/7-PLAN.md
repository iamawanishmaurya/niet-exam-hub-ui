# Phase 7 Plan: PPT Metadata and Faculty Extraction Fixes

## Problem Statement
When viewing PPT assets, the `PaperCard` component is displaying redundant metadata (e.g., multiple "B.Tech", "BTech" tags) while failing to display helpful metadata like Unit and Faculty Name.
- The PPT JSON uses `teacher_name: "Unknown"` but our type system mapping expects `faculty_name`, causing it to be lost.
- The `subject_code` (e.g. `PPT-I-CADANDDIGI-U1`) contains unit information (`-U1`) that is not visually displayed.
- The `course` ("B.Tech"), `branch` ("B.Tech"), and `branch_code` ("BTech") tags cause duplication when they effectively mean the same thing for the general PPT data list.

## Proposed Changes

### 1. `src/types/examPaper.ts`
- Add `teacher_name?: string;` to `AssetMappingItem` to correctly parse the JSON structure.
- Add `unit?: string;` to `NormalizedPaper` and `DisplayPaper` interfaces to support displaying unit information.

### 2. `src/hooks/useExamPapers.ts`
- In the `processedPaths` map inside `normalizeExtractedData`, explicitly map `faculty_name: p.teacher_name || p.faculty_name`.
- During the standard `NormalizedPaper` return, extract the unit from `subjectCode` if the mode is "ppt" (using regex match on `-U(\d+)` suffix).
- Pass `unit` down in `toDisplayPaper`.

### 3. `src/components/PaperCard.tsx`
- Add logic to avoid rendering `branch_code` and `branch` tags if they loosely duplicate the `course` tag (e.g. if `branch === "B.Tech"` and `course === "B.Tech"` or if normalizations match). Hide them specifically for PPT mode to clean up the UI, or simply unify the duplicate check (e.g. `paper.branch !== paper.course` already exists, but "B.Tech" !== "BTech").
- Ensure we remove or hide the `type` badge ("Both" or "Exam") if in PPT mode, as all PPTs are inherently PPTs (or change to a "PPT" badge).
- Render `paper.unit` in a `<Badge>` if it exists, placed neatly with the other metadata.
- Make sure `paper.year` is only rendered if it is NOT `"Unknown"`. Same for `faculty_name` — only render if not `"Unknown"`.

## Verification Plan

### Automated Build
1. Execute `npm run build` to ensure TypeScript compilation passes with added types.

### Manual Verification
1. Open the UI to `/ppt/search`.
2. Inspect cards for any `-U1` or `-U5` subject codes. Validate that a "Unit 1" or "Unit 5" badge is displayed.
3. Validate that only one "B.Tech" badge is visible instead of three redundant tags.
4. Validate that "Unknown" is NOT rendered for year or faculty name.
5. If changing `asset_mapping.json` directly to include a real `teacher_name` temporarily, verify it renders on the card.
