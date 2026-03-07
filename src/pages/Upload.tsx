import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileUp, User, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SEMESTERS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const ACCEPTED = ".pdf,.ppt,.pptx";

type Tab = "single" | "bulk";

interface DroppedFile {
    file: File;
    name: string;
    size: string;
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DropZone = ({
    multiple,
    onDrop,
    files,
}: {
    multiple: boolean;
    onDrop: (files: File[]) => void;
    files: DroppedFile[];
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFiles = (list: FileList | null) => {
        if (!list) return;
        onDrop(Array.from(list));
    };

    const prevent = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

    return (
        <div
            className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer flex flex-col items-center justify-center py-10 px-6 text-center gap-3 ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => { prevent(e); setDragging(true); }}
            onDragLeave={(e) => { prevent(e); setDragging(false); }}
            onDragOver={prevent}
            onDrop={(e) => { prevent(e); setDragging(false); handleFiles(e.dataTransfer.files); }}
        >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <UploadIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
                <p className="font-medium text-foreground">Tap to choose or drag a file</p>
                <p className="text-sm text-muted-foreground mt-0.5">PDF, PPT, PPTX supported</p>
            </div>
            {files.length > 0 && (
                <div className="w-full mt-2 space-y-1">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-left bg-muted/50 rounded-lg px-3 py-2">
                            <FileUp className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate text-foreground flex-1">{f.name}</span>
                            <span className="text-muted-foreground shrink-0">{f.size}</span>
                        </div>
                    ))}
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                multiple={multiple}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );
};

import { appwriteConfig, databases, storage, account, ID } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";

const Upload = () => {
    const { toast } = useToast();
    const [tab, setTab] = useState<Tab>("single");
    const [addContributor, setAddContributor] = useState(false);
    const [contributorName, setContributorName] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Single file state
    const [singleFiles, setSingleFiles] = useState<DroppedFile[]>([]);
    const [singleSemester, setSingleSemester] = useState("");
    const [singleSubject, setSingleSubject] = useState("");

    // Bulk state
    const [bulkFiles, setBulkFiles] = useState<DroppedFile[]>([]);
    const [bulkSemester, setBulkSemester] = useState("");

    const toDropped = (files: File[]): DroppedFile[] =>
        files.map((f) => ({ file: f, name: f.name, size: formatSize(f.size) }));

    const handleSingleUpload = async () => {
        if (singleFiles.length === 0) {
            toast({ title: "No file selected", description: "Please choose a file to upload.", variant: "destructive" });
            return;
        }
        if (!singleSemester) {
            toast({ title: "Semester required", description: "Please select a semester.", variant: "destructive" });
            return;
        }
        if (!singleSubject.trim()) {
            toast({ title: "Subject name required", description: "Please enter the subject name.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        try {
            // First, ensure we have an anonymous session to bypass guest restriction
            try {
                await account.get();
            } catch (err) {
                // If not logged in, create an anonymous session
                await account.createAnonymousSession();
            }

            const file = singleFiles[0].file;

            // 1. Upload to Storage
            const uploadedFile = await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                file
            );

            // 2. Create metadata record
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collectionId,
                ID.unique(),
                {
                    fileName: file.name,
                    semester: singleSemester,
                    subject: singleSubject.trim(),
                    contributor: addContributor ? contributorName.trim() : "",
                    fileId: uploadedFile.$id,
                    size: formatSize(file.size),
                    type: "single"
                },
                // Explicitly grant read/write to anyone
                [
                    Permission.read(Role.any()),
                    Permission.write(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );

            toast({
                title: "Upload successful!",
                description: `"${file.name}" has been uploaded to the database.`,
            });

            setSingleFiles([]);
            setSingleSemester("");
            setSingleSubject("");
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload failed",
                description: error.message || "An error occurred while uploading. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleBulkUpload = async () => {
        if (bulkFiles.length === 0) {
            toast({ title: "No files selected", description: "Please choose files to upload.", variant: "destructive" });
            return;
        }
        if (!bulkSemester) {
            toast({ title: "Semester required", description: "Please select a semester.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Ensure anonymous session first
            try {
                await account.get();
            } catch (err) {
                await account.createAnonymousSession();
            }
        } catch (sessionErr) {
            console.error("Failed to create session:", sessionErr);
            toast({
                title: "Authentication error",
                description: "Could not create an anonymous session. Please try again.",
                variant: "destructive"
            });
            setIsUploading(false);
            return;
        }

        for (const df of bulkFiles) {
            try {
                // 1. Upload file
                const uploadedFile = await storage.createFile(
                    appwriteConfig.bucketId,
                    ID.unique(),
                    df.file
                );

                // 2. Metadata record
                await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.collectionId,
                    ID.unique(),
                    {
                        fileName: df.file.name,
                        semester: bulkSemester,
                        subject: "", // No subject for bulk
                        contributor: addContributor ? contributorName.trim() : "",
                        fileId: uploadedFile.$id,
                        size: formatSize(df.file.size),
                        type: "bulk"
                    },
                    // Explicitly grant read/write to anyone
                    [
                        Permission.read(Role.any()),
                        Permission.write(Role.any()),
                        Permission.update(Role.any()),
                        Permission.delete(Role.any()),
                    ]
                );
                successCount++;
            } catch (error) {
                console.error(`Failed to upload ${df.file.name}:`, error);
                failCount++;
            }
        }

        setIsUploading(false);

        if (failCount === 0) {
            toast({
                title: "Bulk upload complete!",
                description: `Successfully uploaded ${successCount} files.`,
            });
            setBulkFiles([]);
            setBulkSemester("");
        } else {
            toast({
                title: "Bulk upload partially completed",
                description: `${successCount} uploaded, ${failCount} failed. Check console for details.`,
                variant: "destructive"
            });
            // Keep the failed files in state if needed, or just clear
            if (successCount === 0) {
                // all failed
            } else {
                setBulkFiles([]);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Page title */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Upload Resources</h1>
                        <p className="text-muted-foreground">Share your study materials and help fellow students.</p>
                    </div>

                    {/* Contributor toggle */}
                    <div className="border border-border rounded-xl p-5 mb-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <Switch
                                id="contributor"
                                checked={addContributor}
                                onCheckedChange={setAddContributor}
                            />
                            <div>
                                <Label htmlFor="contributor" className="font-medium flex items-center gap-2 cursor-pointer">
                                    <User className="h-4 w-4" />
                                    Add my name as a contributor
                                </Label>
                                <p className="text-sm text-muted-foreground mt-0.5">Your name appears on the About page</p>
                            </div>
                        </div>
                        {addContributor && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                <Input
                                    value={contributorName}
                                    onChange={(e) => setContributorName(e.target.value)}
                                    placeholder="Your full name, e.g. Awanish Kumar Maurya"
                                    className="border-border bg-background"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="grid grid-cols-2 rounded-xl border border-border overflow-hidden mb-6">
                        {(["single", "bulk"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === t
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {t === "single" ? <FileUp className="h-4 w-4" /> : <UploadIcon className="h-4 w-4" />}
                                {t === "single" ? "Single File" : "Bulk Upload"}
                            </button>
                        ))}
                    </div>

                    {/* Single File tab */}
                    {tab === "single" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div>
                                <h2 className="font-semibold text-foreground mb-1">Single File Upload</h2>
                                <p className="text-sm text-muted-foreground">Fill in the details so students can find this easily.</p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    File <span className="text-destructive">*</span>
                                </Label>
                                <DropZone multiple={false} onDrop={(f) => setSingleFiles(toDropped(f))} files={singleFiles} />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Semester <span className="text-destructive">*</span>
                                </Label>
                                <Select value={singleSemester} onValueChange={setSingleSemester}>
                                    <SelectTrigger className="w-full border-border bg-background">
                                        <SelectValue placeholder="Select semester..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMESTERS.map((s) => (
                                            <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Subject Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    value={singleSubject}
                                    onChange={(e) => setSingleSubject(e.target.value)}
                                    placeholder="e.g. Data Structures"
                                    className="border-border bg-background"
                                />
                            </div>

                            <Button onClick={handleSingleUpload} disabled={isUploading} className="w-full gap-2">
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
                                {isUploading ? "Uploading..." : "Upload File"}
                            </Button>
                        </motion.div>
                    )}

                    {/* Bulk Upload tab */}
                    {tab === "bulk" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div>
                                <h2 className="font-semibold text-foreground mb-1">Bulk Upload</h2>
                                <p className="text-sm text-muted-foreground">Upload multiple slides at once. The system auto-organises by semester.</p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-medium">Semester</Label>
                                <Select value={bulkSemester} onValueChange={setBulkSemester}>
                                    <SelectTrigger className="w-full border-border bg-background">
                                        <SelectValue placeholder="Select semester..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMESTERS.map((s) => (
                                            <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-medium">Files</Label>
                                <DropZone multiple={true} onDrop={(f) => setBulkFiles(toDropped(f))} files={bulkFiles} />
                            </div>

                            <Button onClick={handleBulkUpload} disabled={isUploading} className="w-full gap-2">
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
                                {isUploading ? "Uploading..." : "Upload Files"}
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Upload;
