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
import { ExternalLink, Download, Loader2, Flag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { appwriteConfig, databases, ID } from "@/lib/appwrite";

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
  const [reportText, setReportText] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let active = true;

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
          const pdfBlob = new Blob([blob], { type: "application/pdf" });
          const url = URL.createObjectURL(pdfBlob);
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

  const handleReport = async () => {
    if (!reportText.trim()) {
      toast.error("Please provide some details about the issue.");
      return;
    }

    setIsReporting(true);
    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.reportsCollectionId,
        ID.unique(),
        {
          pdfId: title,
          pdfPath: pdfPath,
          message: reportText,
          timestamp: new Date().toISOString()
        }
      );
      toast.success("Thank you! Your report has been submitted.");
      setReportOpen(false);
      setReportText("");
    } catch (error) {
      console.error("Report failed:", error);
      toast.error("Failed to submit report. Ensure the 'reports' backend collection is configured.");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[92vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Review, preview, or download the document below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden relative bg-muted/20 flex items-center justify-center">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfPath)}&embedded=true`}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>
        <DialogFooter className="px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Popover open={reportOpen} onOpenChange={setReportOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive transition-colors">
                  <Flag className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Report Issue</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Report an Issue</h4>
                  <p className="text-xs text-muted-foreground">Describe what's wrong with this document (e.g., blurry, wrong subject, pages missing).</p>
                  <Textarea
                    placeholder="Provide details..."
                    className="min-h-[80px] resize-none text-sm"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setReportOpen(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleReport} disabled={isReporting}>
                      {isReporting && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                      Submit
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenInNewTab}
              className="border-border rounded-lg"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Open in new tab</span>
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

