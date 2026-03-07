import { memo, useState } from "react";
import { DisplayPaper } from "@/types/examPaper";
import { Button } from "./ui/button";
import { Download, Eye, TrendingUp, ChevronDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface PaperCardProps {
  paper: DisplayPaper;
  isSelected?: boolean;
  onToggleSelect?: (paperId: string) => void;
  showCheckbox?: boolean;
  onPreview?: (path: string, title: string) => void;
}

const PaperCard = ({
  paper,
  isSelected,
  onToggleSelect,
  showCheckbox,
  onPreview
}: PaperCardProps) => {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const hasMultipleFiles = paper.paths.length > 1;
  const primaryPath = paper.primaryPath || (paper.paths[0]?.path || "");
  const primaryFilename = paper.primaryFilename || (paper.paths[0]?.filename || "");

  const handleDownload = async (path?: string, filename?: string) => {
    const downloadPath = path || primaryPath;
    const downloadFilename = filename || primaryFilename;

    if (downloadPath && !downloadingFile) {
      try {
        setDownloadingFile(downloadPath);
        const res = await fetch(downloadPath);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        if (downloadFilename) {
          link.download = downloadFilename;
        } else {
          link.download = downloadPath.split("/").pop() || "document.pdf";
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download error:", error);
      } finally {
        setDownloadingFile(null);
      }
    }
  };

  const handlePreview = (path?: string) => {
    const previewPath = path || primaryPath;
    if (previewPath && onPreview) {
      onPreview(previewPath, paper.subject_name);
    } else if (previewPath) {
      window.open(previewPath, "_blank");
    }
  };

  const getTypeBadge = () => {
    if (paper.type === "cop") return "COP";
    if (paper.type === "both") return "COP & Exam";
    return "Exam";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-background border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {showCheckbox && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect?.(paper.id)}
              className="mt-1 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {paper.subject_name}
              </h3>
            </div>
            {paper.subject_code && (
              <p className="text-sm text-muted-foreground font-mono mb-2">
                {paper.subject_code}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {paper.course && (
          <Badge variant="secondary" className="text-xs">
            {paper.course}
          </Badge>
        )}
        {paper.year && (
          <Badge variant="outline" className="text-xs">
            {paper.year}
          </Badge>
        )}
        {paper.semester && (
          <Badge variant="outline" className="text-xs">
            {paper.semester} Semester
          </Badge>
        )}
        {paper.branch_code && (
          <Badge variant="outline" className="text-xs">
            {paper.branch_code}
          </Badge>
        )}
        {paper.branch && (
          <Badge variant="outline" className="text-xs">
            {paper.branch}
          </Badge>
        )}
        {paper.faculty_name && (
          <Badge variant="outline" className="text-xs">
            {paper.faculty_name}
          </Badge>
        )}
        <Badge variant="default" className="text-xs">
          {getTypeBadge()}
        </Badge>
        {hasMultipleFiles && (
          <Badge variant="secondary" className="text-xs">
            {paper.paths.length} files
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        {hasMultipleFiles ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePreview()}
              className="flex-1 border-border hover:bg-accent hover:border-primary transition-all rounded-lg"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download ({paper.paths.length})
                  <ChevronDown className="h-4 w-4 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {paper.paths.map((pathItem, index) => (
                  <div key={index}>
                    <DropdownMenuItem
                      onClick={() => handlePreview(pathItem.path)}
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View: {pathItem.filename} ({pathItem.type === "cop" ? "COP" : "Exam"})
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(pathItem.path, pathItem.filename)}
                      className="cursor-pointer"
                      disabled={downloadingFile === pathItem.path}
                    >
                      {downloadingFile === pathItem.path ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {downloadingFile === pathItem.path ? "Downloading..." : `Download: ${pathItem.filename} (${pathItem.type === "cop" ? "COP" : "Exam"})`}
                    </DropdownMenuItem>
                    {index < paper.paths.length - 1 && <DropdownMenuSeparator />}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePreview()}
              className="flex-1 border-border hover:bg-accent hover:border-primary transition-all rounded-lg"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
            </Button>
            <Button
              size="sm"
              disabled={downloadingFile === primaryPath}
              onClick={() => handleDownload()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              {downloadingFile === primaryPath ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              {downloadingFile === primaryPath ? "Downloading..." : "Download"}
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default memo(PaperCard);
