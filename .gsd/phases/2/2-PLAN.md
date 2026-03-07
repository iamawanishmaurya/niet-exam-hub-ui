---
phase: 2
plan: 1
wave: 1
depends_on: [1]
files_modified: [
  "src/components/PdfPreviewModal.tsx",
  "src/components/PaperCard.tsx"
]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Users can preview PDFs in the modal iframe without X-Frame-Options errors"
    - "Users can download PDFs seamlessly from the new domains"
  artifacts:
    - "Modified PdfPreviewModal.tsx"
    - "Modified PaperCard.tsx"
---

# Plan 2.1: Fix PDF Preview iframe & Download Button X-Frame-Options / CORS 

<objective>
Update the PDF preview and download capabilities to handle the cross-origin nature of the new GitHub raw links. 

Purpose: Direct raw.githubusercontent.com URLs in an `<iframe>` will be blocked by `X-Frame-Options: deny`. Thus, the preview function needs to use a PDF viewer proxy, such as `https://docs.google.com/viewer?url={URL}&embedded=true`. The `<a download>` attribute is also restricted to same-origin requests, so downloading a cross-origin URL directly via fetch -> blob or direct `window.open(url)` might be necessary instead of injecting anchor tags for the user to download seamlessly.
Output: Modified `PdfPreviewModal.tsx` and `PaperCard.tsx`.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/components/PdfPreviewModal.tsx
- src/components/PaperCard.tsx
</context>

<tasks>

<task type="auto">
  <name>Update iframe source with Google Docs Viewer proxy</name>
  <files>src/components/PdfPreviewModal.tsx</files>
  <action>
    Modify `PdfPreviewModal` iframe `src` to wrap the `pdfPath` in the Google Docs viewer API so it bypasses `X-Frame-Options: deny`.
    Change `src={pdfPath}` to:
    `src={\`https://docs.google.com/viewer?url=${encodeURIComponent(pdfPath)}&embedded=true\`}`
    
    Similarly, fix the `handleDownload` logic. `link.download` does not work across origins. A reliable method for downloading cross-origin files without a backend proxy is converting it via fetch (though github raw is permissive with CORS origin '*', it might take some time for big files). If fetch is too complex for big files, just use `window.open(pdfPath, "_blank")` for download fallback, OR fetch and make a Blob object url.
    Let's implement the Blob fetch method for handleDownload since `raw.githubusercontent.com` allows `Access-Control-Allow-Origin: *`.
    ```javascript
    fetch(pdfPath)
      .then(res => res.blob())
      .then(blob => {
         const blobUrl = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = blobUrl;
         link.download = pdfPath.split("/").pop() || "paper.pdf";
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(blobUrl);
      })
    ```
    Add a subtle downloading state if you prefer, or just execute the fetch.
  </action>
  <verify>grep -q "docs.google.com/viewer" src/components/PdfPreviewModal.tsx</verify>
  <done>PdfPreviewModal utilizes the Google Docs Viewer to render the iframe and utilizes a fetch blob for downloads.</done>
</task>

<task type="auto">
  <name>Update PaperCard Download handler</name>
  <files>src/components/PaperCard.tsx</files>
  <action>
    Modify the `handleDownload` function in `src/components/PaperCard.tsx` to handle cross-origin downloading, identical to the strategy inside `PdfPreviewModal`.
    Use a `fetch(downloadPath).then(r => r.blob()).then(blob => ...)` technique or something similar to ensure `download=filename` works effectively. Add an `isDownloading` state so users know the file is being fetched.
  </action>
  <verify>grep -q "fetch(" src/components/PaperCard.tsx</verify>
  <done>PaperCard can download files using blob fetch across origins with proper filenames.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [x] Google Docs viewer is integrated into the modal.
- [x] Blobs are generated via fetch to enforce the download filename.
</verification>

<success_criteria>
- [x] All tasks verified
- [x] Must-haves confirmed
</success_criteria>
