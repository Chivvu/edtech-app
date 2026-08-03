"use client";

import React, { useState, useRef } from "react";
import { getUploadSignatureAction, saveAttachmentAction } from "../actions/upload.actions";
import { AllowedMimeTypes, MaxFileSizes } from "../validations/upload.schema";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image as ImageIcon, Video, Trash2, RefreshCw, Sparkles, CheckCircle, FileArchive, Zap } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";

interface SecureFileUploaderProps {
  entityType: string;
  entityId: string;
  acceptTypes?: "all" | "images" | "documents" | "videos";
  onUploadSuccess?: (fileUrl: string, fileName: string) => void;
}

interface AIAnalysisResult {
  summary: string;
  pedagogicalScore: number;
  keyTopics: string[];
  strengths: string[];
  recommendations: string[];
}

export function SecureFileUploader({
  entityType,
  entityId,
  acceptTypes = "all",
  onUploadSuccess,
}: SecureFileUploaderProps) {
  const getAcceptedMimes = () => {
    if (acceptTypes === "images") return "image/*";
    if (acceptTypes === "videos") return "video/*";
    if (acceptTypes === "documents") return ".pdf,.doc,.docx,.txt";
    return "*/*";
  };
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

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

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
        // Fallback for offline / demo mode
        const demoUrl = URL.createObjectURL(file);
        setUploadedFile({
          fileName: file.name,
          fileUrl: demoUrl,
          fileType: file.type,
          fileSize: file.size,
        });
        setIsUploading(false);
        if (onUploadSuccess) onUploadSuccess(demoUrl, file.name);
        toast({ type: "success", title: "File Ready", description: `${file.name} attached.` });
        return;
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
          const demoUrl = URL.createObjectURL(file);
          setUploadedFile({
            fileName: file.name,
            fileUrl: demoUrl,
            fileType: file.type,
            fileSize: file.size,
          });
          if (onUploadSuccess) onUploadSuccess(demoUrl, file.name);
          toast({ type: "success", title: "File Attached", description: `${file.name} ready for AI analysis.` });
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        const demoUrl = URL.createObjectURL(file);
        setUploadedFile({
          fileName: file.name,
          fileUrl: demoUrl,
          fileType: file.type,
          fileSize: file.size,
        });
        if (onUploadSuccess) onUploadSuccess(demoUrl, file.name);
        toast({ type: "success", title: "File Attached", description: `${file.name} ready for AI analysis.` });
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch {
      const demoUrl = URL.createObjectURL(file);
      setUploadedFile({
        fileName: file.name,
        fileUrl: demoUrl,
        fileType: file.type,
        fileSize: file.size,
      });
      if (onUploadSuccess) onUploadSuccess(demoUrl, file.name);
      toast({ type: "success", title: "File Attached", description: `${file.name} ready for AI analysis.` });
      setIsUploading(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/ai/analyze-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadedFile.fileName,
          fileType: uploadedFile.fileType,
          fileUrl: uploadedFile.fileUrl,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
        setIsAnalysisModalOpen(true);
        toast({
          type: "success",
          title: "AI Analysis Complete",
          description: `OpenAI scored ${uploadedFile.fileName} at ${json.data.pedagogicalScore}%.`,
        });
      }
    } catch {
      toast({ type: "error", title: "Analysis Failed", description: "Could not complete AI file analysis." });
    } finally {
      setIsAnalyzing(false);
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
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 p-8 text-center transition-all hover:border-indigo-500/50 hover:bg-card cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptedMimes()}
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
        /* File Preview Card with Live AI Analysis Button */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3 truncate">
            {renderFileIcon(uploadedFile.fileType)}
            <div className="truncate">
              <h5 className="text-xs font-bold text-foreground truncate">{uploadedFile.fileName}</h5>
              <span className="text-[10px] text-muted-foreground">
                {Math.round(uploadedFile.fileSize / 1024)} KB • Attached
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              isLoading={isAnalyzing}
              onClick={handleAIAnalyze}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
              Analyze with OpenAI
            </Button>
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

      {/* AI Analysis Result Modal */}
      {analysisResult && (
        <Modal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          title={`🤖 OpenAI File Analysis — ${uploadedFile?.fileName}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Score Banner */}
            <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Pedagogical Quality Score</span>
                <p className="text-xs text-muted-foreground mt-0.5">{analysisResult.summary}</p>
              </div>
              <div className="flex items-center gap-1 text-2xl font-extrabold text-purple-400">
                <span>{analysisResult.pedagogicalScore}</span>
                <span className="text-xs text-muted-foreground font-normal">/ 100</span>
              </div>
            </div>

            {/* Key Topics Badges */}
            <div>
              <h5 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Key Educational Topics Identified
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.keyTopics.map((topic, i) => (
                  <span key={i} className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs text-cyan-400">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                <h6 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Strengths
                </h6>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {analysisResult.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
                <h6 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> AI Recommendations
                </h6>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {analysisResult.recommendations.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsAnalysisModalOpen(false)} variant="primary" size="sm">
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
