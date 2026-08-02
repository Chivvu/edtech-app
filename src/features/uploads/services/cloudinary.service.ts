import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "eduflow-ai",
  api_key: process.env.CLOUDINARY_API_KEY || "demo_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret",
  secure: true,
});

export class CloudinaryService {
  static async generateUploadSignature(folder: string = "eduflow_attachments") {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || "demo_secret"
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY || "demo_key",
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "eduflow-ai",
      folder,
    };
  }

  static async saveAttachmentRecord(
    data: {
      entityType: string;
      entityId: string;
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
    },
    uploadedById: string
  ) {
    return prisma.attachment.create({
      data: {
        uploadedById,
        entityType: data.entityType,
        entityId: data.entityId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
      },
    });
  }

  static async deleteAttachment(attachmentId: string, userId: string) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new Error("Attachment record not found.");
    }

    // Delete record from Database
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return { success: true };
  }
}
