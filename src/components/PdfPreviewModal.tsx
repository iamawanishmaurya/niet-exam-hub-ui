import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Download, Loader2 } from "lucide-react";

interface PdfPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfPath: string;
  title: string;
}

const PdfPreviewModal = ({ open, onOpenChange, pdfPath, title }: PdfPreviewModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isFetchingBlob, setIsFetchingBlob] = useState(false);

  useEffect(() => {
    let active = true;

    // Cleanup previous blob URL
    const cleanup = () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        if (active) setBlobUrl(null);
      }
    };

    if (open && pdfPath) {
      cleanup();
      setIsFetchingBlob(true);
      fetch(pdfPath)
        .then(res => res.blob())
        .then(blob => {
          if (!active) return;
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setIsFetchingBlob(false);
        })
        .catch(err => {
          console.error("Failed to fetch PDF blob:", err);
          if (active) setIsFetchingBlob(false);
        });
    } else {
      cleanup();
    }

    return () => {
      active = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pdfPath]);

  const handleDownload = async () => {
    if (pdfPath && !isDownloading) {
      if (blobUrl) {
        // Fast path: use existing blob url
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = pdfPath.split("/").pop() || "paper.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      try {
        setIsDownloading(true);
        const res = await fetch(pdfPath);
        const blob = await res.blob();
        const freshBlobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = freshBlobUrl;
        link.download = pdfPath.split("/").pop() || "paper.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(freshBlobUrl);
      } catch (error) {
        console.error("Download error:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfPath) {
      window.open(pdfPath, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[92vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs font-mono truncate">
            {pdfPath}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden relative bg-muted/20 flex items-center justify-center">
          {isFetchingBlob ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground w-full py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
              <p className="text-sm font-medium">Bypassing restrictions and loading PDF directly...</p>
            </div>
          ) : blobUrl ? (
            <iframe
              src={`${blobUrl}#view=FitH`}
              title={title}
              className="w-full h-full border-0 absolute inset-0"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground w-full py-12">
              <p className="text-sm">Unable to preview document.</p>
            </div>
          )}
        </div>
        <DialogFooter className="px-6 py-4 border-t flex items-center justify-between">
          <small className="text-muted-foreground text-xs truncate flex-1 mr-4">
            {pdfPath}
          </small>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenInNewTab}
              className="border-border rounded-lg"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open in new tab
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewModal;

