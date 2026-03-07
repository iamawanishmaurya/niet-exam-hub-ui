---
phase: 4
plan: 1
wave: 1
depends_on: [2]
files_modified: [
  "src/components/PdfPreviewModal.tsx"
]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Users can preview PDFs seamlessly without relying on the Google Docs proxy"
  artifacts:
    - "Modified PdfPreviewModal.tsx"
---

# Plan 4.1: Use Object URLs for PDF Preview (Replacing Google Docs proxy)

<objective>
Remove the reliance on the flaky `docs.google.com/viewer` proxy, which frequently fails with "No preview option available". We will replace it with an object URL blob fetching mechanism similar to how the download button works for crossing the `X-Frame-Options` boundary.

Purpose: GitHub raw files enforce `X-Frame-Options: deny`, but allow `Access-Control-Allow-Origin: *`. This means we can fetch the blob string entirely into the browser and inject it into `<object>` or `<iframe>` directly using `URL.createObjectURL(blob)`, completely side-stepping all limits natively.
Output: Modified `PdfPreviewModal.tsx`.
</objective>

<context>
Load for context:
- src/components/PdfPreviewModal.tsx
</context>

<tasks>

<task type="auto">
  <name>Convert iframe src to use Blob URLs</name>
  <files>src/components/PdfPreviewModal.tsx</files>
  <action>
    Refactor `PdfPreviewModal` to contain a `useEffect` that triggers when `pdfPath` or `open` changes and unmounts properly.
    When `open` is true, trigger a `fetch` for `pdfPath` and convert it to a `.blob()`. Then call `URL.createObjectURL(blob)` and save this blob URL into a new local state `blobUrl`.
    Replace the iframe `src` with `blobUrl` (use `#view=FitH` hash suffix if you want to make it look professional).
    If `blobUrl` is not yet available, show a loading indicator like `<Loader2 className="animate-spin ... />` or a generic "Loading PDF..." skeleton instead of the iframe.
    Important: Clean up the Blob URL using `URL.revokeObjectURL` within the `useEffect` cleanup hook or when `open` turns false.
  </action>
  <verify>grep -q "URL.createObjectURL" src/components/PdfPreviewModal.tsx && grep -q "useEffect" src/components/PdfPreviewModal.tsx</verify>
  <done>The PDF modal dynamically loads and displays the document utilizing an object blob URL to bypass cross-origin restrictions, without Google docs viewer.</done>
</task>

<task type="auto">
  <name>Adopt Modal to Object URL Download</name>
  <files>src/components/PdfPreviewModal.tsx</files>
  <action>
    Since we already have the Blob URL loaded in state for the iframe preview, refactor `handleDownload` inside `PdfPreviewModal.tsx` to simply use the `blobUrl` variable directly rather than fetching the file a second time.
  </action>
  <verify>grep -q "href = blobUrl" src/components/PdfPreviewModal.tsx</verify>
  <done>If preview object URL is available, download leverages the pre-cached blob URL instead of executing another request.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] No references to `docs.google.com/viewer` exist in the codebase.
- [ ] `PdfPreviewModal` implements a loading state while fetching the blob.
- [ ] `URL.revokeObjectURL` is used appropriately to clean up memory.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
