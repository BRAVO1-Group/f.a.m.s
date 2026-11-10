import type {
  MockActivity,
  MockAttendance,
  MockEvaluation,
  MockInternship,
  MockMilestone,
  MockMilestoneTask,
  MockOrganization,
  MockPermission,
  MockSupervisor,
  MockUser,
  PermissionCategory,
  RolePermissionsMap,
  SupervisorType,
} from "@/lib/mock-data";
import type { AppRole } from "@/lib/auth";

export type {
  AppRole,
  PermissionCategory,
  RolePermissionsMap,
  SupervisorType,
};

export type User = MockUser;
export type Activity = MockActivity;
export type Attendance = MockAttendance;
export type Organization = MockOrganization;
export type Internship = MockInternship;
export type Supervisor = MockSupervisor;
export type Permission = MockPermission;
export type MilestoneTask = MockMilestoneTask;
export type Milestone = MockMilestone;
export type Evaluation = MockEvaluation;

export interface SharedData {
  auth: {
    user: User | null;
    role: AppRole;
    permissions: string[];
  };
  flash?: {
    success?: string;
    error?: string;
    info?: string;
  };
  [key: string]: unknown;
}
