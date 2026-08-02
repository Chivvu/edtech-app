import { z } from "zod";

export const AllowedMimeTypes = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
  ],
  videos: ["video/mp4", "video/webm", "video/quicktime"],
};

export const MaxFileSizes = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 25 * 1024 * 1024, // 25MB
  VIDEO: 100 * 1024 * 1024, // 100MB
};

export const FileUploadSchema = z.object({
  fileName: z.string().min(1, "Filename is required."),
  fileType: z.string().min(1, "File mime type is required."),
  fileSize: z.number().max(MaxFileSizes.VIDEO, "File exceeds maximum size limit of 100MB."),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
});

export type FileUploadInput = z.infer<typeof FileUploadSchema>;
