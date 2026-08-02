"use server";

import { auth } from "@/lib/auth";
import { CloudinaryService } from "../services/cloudinary.service";
import { FileUploadSchema, FileUploadInput } from "../validations/upload.schema";

export async function getUploadSignatureAction(folder?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const params = await CloudinaryService.generateUploadSignature(folder);
  return { success: true, data: params };
}

export async function saveAttachmentAction(
  data: FileUploadInput & { fileUrl: string }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  const validated = FileUploadSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid upload metadata." };
  }

  const attachment = await CloudinaryService.saveAttachmentRecord(
    {
      entityType: data.entityType,
      entityId: data.entityId,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
    },
    session.user.id
  );

  return { success: true, data: attachment };
}

export async function deleteAttachmentAction(attachmentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized access." };
  }

  await CloudinaryService.deleteAttachment(attachmentId, session.user.id);
  return { success: true, message: "Attachment deleted successfully." };
}
