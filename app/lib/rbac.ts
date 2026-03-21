export type Role = "ADMIN" | "CONVENER" | "STAFF";

export type Permission =
  | "MANAGE_VENUE"
  | "VIEW_VENUE"
  | "VIEW_STAFF"
  | "MANAGE_STAFF"
  | "VIEW_MEETING_TYPE"
  | "ADD_MEETING_TYPE"
  | "EDIT_MEETING_TYPE"
  | "DELETE_MEETING_TYPE"
  | "VIEW_DEPARTMENT"
  | "VIEW_DASHBOARD"
  | "MANAGE_MASTER"
  | "CREATE_MEETING"
  | "EDIT_MEETING"
  | "CANCEL_MEETING"
  | "VIEW_MEETING"
  | "ADD_PARTICIPANT"
  | "MARK_ATTENDANCE"
  | "VIEW_REPORT"
  | "EXPORT_REPORT"
  | "ADD_DEPARTMENT"
  | "DELETE_DEPARTMENT"
  | "EDIT_DEPARTMENT";

export const rolePermissions: Record<Role, Set<Permission>> = {
  ADMIN: new Set([
    "MANAGE_VENUE",
    "VIEW_VENUE",
    "VIEW_STAFF",
    "MANAGE_STAFF",
    "VIEW_MEETING_TYPE",
    "ADD_MEETING_TYPE",
    "EDIT_MEETING_TYPE",
    "DELETE_MEETING_TYPE",
    "VIEW_DEPARTMENT",
    "EDIT_DEPARTMENT",
    "DELETE_DEPARTMENT",
    "ADD_DEPARTMENT",
    "VIEW_DASHBOARD",
    "MANAGE_MASTER",
    "CREATE_MEETING",
    "EDIT_MEETING",
    "CANCEL_MEETING",
    "VIEW_MEETING",
    "ADD_PARTICIPANT",
    "MARK_ATTENDANCE",
    "VIEW_REPORT",
    "EXPORT_REPORT",
  ]),

  CONVENER: new Set([
    "VIEW_DASHBOARD",
    "CREATE_MEETING",
    "EDIT_MEETING",
    "CANCEL_MEETING",
    "VIEW_MEETING",
    "ADD_PARTICIPANT",
    "MARK_ATTENDANCE",
    "VIEW_REPORT",
    "EXPORT_REPORT",
    "VIEW_MEETING_TYPE",
    "VIEW_VENUE",
  ]),

  STAFF: new Set([
    "VIEW_DASHBOARD",
    "VIEW_MEETING",
  ]),
};

export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return rolePermissions[role]?.has(permission) ?? false;
}
