"use client";

import React, { useState, useRef } from "react";
import { getUploadSignatureAction, saveAttachmentAction } from "../actions/upload.actions";
import { AllowedMimeTypes, MaxFileSizes } from "../validations/upload.schema";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image as ImageIcon, Video, Trash2, RefreshCw, CheckCircle, AlertCircle, FileArchive } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface SecureFileUploaderProps {
  entityType: string;
  entityId: string;
  acceptTypes?: "all" | "images" | "documents" | "videos";
  onUploadSuccess?: (fileUrl: string, fileName: string) => void;
}

export function SecureFileUploader({
  entityType,
  entityId,
  acceptTypes = "all",
  onUploadSuccess,
}: SecureFileUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  } | null>(null);

  const handleFileSelect = async (file: File) => {
    // 1. Client-side Validation
    const isImage = AllowedMimeTypes.images.includes(file.type);
    const isDoc = AllowedMimeTypes.documents.includes(file.type);
    const isVideo = AllowedMimeTypes.videos.includes(file.type);

    if (!isImage && !isDoc && !isVideo) {
      toast({
        type: "error",
        title: "Unsupported File Type",
        description: "Please upload an Image, PDF, PPT, DOCX, ZIP, or MP4 video.",
      });
      return;
    }

    let maxSize = MaxFileSizes.DOCUMENT;
    if (isImage) maxSize = MaxFileSizes.IMAGE;
    if (isVideo) maxSize = MaxFileSizes.VIDEO;

    if (file.size > maxSize) {
      toast({
        type: "error",
        title: "File Too Large",
        description: `File size exceeds max limit of ${Math.round(maxSize / (1024 * 1024))}MB.`,
      });
      return;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      // 2. Fetch Signed Upload Parameters from Server Action
      const sigRes = await getUploadSignatureAction("eduflow_attachments");
      if (!sigRes.success || !sigRes.data) {
        throw new Error("Failed to authenticate upload request.");
      }

      const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;

      // 3. Direct Upload to Cloudinary API via XMLHttpRequest with progress tracking
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 90);
          setProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url;

          setProgress(100);

          // 4. Save Attachment Metadata Record in Postgres
          await saveAttachmentAction({
            entityType,
            entityId,
            fileName: file.name,
            fileUrl: secureUrl,
            fileType: file.type,
            fileSize: file.size,
          });

          setUploadedFile({
            fileName: file.name,
            fileUrl: secureUrl,
            fileType: file.type,
            fileSize: file.size,
          });

          if (onUploadSuccess) {
            onUploadSuccess(secureUrl, file.name);
          }

          toast({
            type: "success",
            title: "File Uploaded Securely",
            description: `${file.name} uploaded and attached.`,
          });
        } else {
          toast({ type: "error", title: "Upload Failed", description: "Cloudinary upload rejected file." });
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        toast({ type: "error", title: "Network Error", description: "Upload failed due to network error." });
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch {
      toast({ type: "error", title: "Error", description: "An error occurred during file upload." });
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const renderFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-indigo-400" />;
    if (fileType.startsWith("video/")) return <Video className="h-6 w-6 text-purple-400" />;
    if (fileType.includes("zip")) return <FileArchive className="h-6 w-6 text-amber-400" />;
    return <FileText className="h-6 w-6 text-emerald-400" />;
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 p-8 text-center transition-all hover:border-indigo-500/50 hover:bg-card cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          <div className="rounded-full p-3 bg-muted border border-border group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-indigo-400" />
          </div>

          <div className="mt-3">
            <span className="text-xs font-bold text-foreground">Click to upload or drag and drop</span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Supports Images, PDFs, PPTX, DOCX, ZIP, and MP4 videos (up to 100MB)
            </p>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4 w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-indigo-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* File Preview Card */
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3 truncate">
            {renderFileIcon(uploadedFile.fileType)}
            <div className="truncate">
              <h5 className="text-xs font-bold text-foreground truncate">{uploadedFile.fileName}</h5>
              <span className="text-[10px] text-muted-foreground">
                {Math.round(uploadedFile.fileSize / 1024)} KB • Upload Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => setUploadedFile(null)}
            >
              Replace
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUploadedFile(null)}
              title="Remove Attachment"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
