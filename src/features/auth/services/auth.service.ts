import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async generateToken(
    identifier: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR",
    expiresHours: number = 24
  ) {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + expiresHours * 60 * 60 * 1000);

    await prisma.verificationToken.deleteMany({
      where: { identifier, type },
    });

    return prisma.verificationToken.create({
      data: {
        identifier,
        token,
        type,
        expires,
      },
    });
  }

  static async verifyToken(
    tokenString: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "TWO_FACTOR"
  ) {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token: tokenString },
    });

    if (!existingToken || existingToken.type !== type) {
      return { isValid: false, error: "Invalid token." };
    }

    if (new Date() > existingToken.expires) {
      await prisma.verificationToken.delete({ where: { id: existingToken.id } });
      return { isValid: false, error: "Token has expired." };
    }

    return { isValid: true, token: existingToken };
  }

  static async consumeToken(tokenId: string) {
    return prisma.verificationToken.delete({ where: { id: tokenId } });
  }

  static async verifyTwoFactorCode(userEmail: string, code: string): Promise<boolean> {
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: userEmail,
        token: code,
        type: "TWO_FACTOR",
      },
    });

    if (!tokenRecord || new Date() > tokenRecord.expires) {
      return false;
    }

    await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
    return true;
  }
}
