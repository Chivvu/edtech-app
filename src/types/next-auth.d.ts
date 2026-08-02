import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizationId: string;
      role: string;
      permissions: string[];
      isTwoFactorVerified?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    organizationId?: string;
    role?: string;
    permissions?: string[];
    isTwoFactorVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    organizationId: string;
    role: string;
    permissions: string[];
    isTwoFactorVerified?: boolean;
    rememberMe?: boolean;
  }
}
