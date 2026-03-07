import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink, Download } from "lucide-react";

interface PdfPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfPath: string;
  title: string;
}

const PdfPreviewModal = ({ open, onOpenChange, pdfPath, title }: PdfPreviewModalProps) => {
  const handleDownload = () => {
    if (pdfPath) {
      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = pdfPath.split("/").pop() || "paper.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfPath}
            title={title}
            className="w-full h-full border-0"
            style={{ minHeight: "400px" }}
          />
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewModal;

