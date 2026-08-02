import { Session } from "next-auth";

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  INSTRUCTIONAL_DESIGNER: "INSTRUCTIONAL_DESIGNER",
  SME_REVIEWER: "SME_REVIEWER",
  COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
  READ_ONLY_AUDITOR: "READ_ONLY_AUDITOR",
} as const;

export function hasRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  if (userRole === SYSTEM_ROLES.SUPER_ADMIN) return true; // Super admin overrides
  return allowedRoles.includes(userRole);
}

export function hasPermission(userPermissions: string[] | undefined, requiredPermission: string): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission) || userPermissions.includes("*");
}

export function hasAllPermissions(userPermissions: string[] | undefined, requiredPermissions: string[]): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.every((perm) => hasPermission(userPermissions, perm));
}

export function requireRole(user: Session["user"] | undefined, allowedRoles: string[]): boolean {
  if (!user) return false;
  return hasRole(user.role, allowedRoles);
}

export function requirePermission(user: Session["user"] | undefined, requiredPermission: string): boolean {
  if (!user) return false;
  return hasPermission(user.permissions, requiredPermission);
}
